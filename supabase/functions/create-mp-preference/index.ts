

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore
Deno.serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Verifica Token (Opcional: Se não tiver, usa mock para teste)
    // @ts-ignore
    const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");

    if (!MP_ACCESS_TOKEN) {
      console.error("MP_ACCESS_TOKEN ausente.");
      // Se não tiver token configurado no servidor, retorna erro JSON claro
      // para que o Frontend ative o Fallback Local
      throw new Error("Token do Mercado Pago não configurado no Supabase Secrets.");
    }

    const { order, items, return_url } = await req.json();

    // 3. Monta Itens para Mercado Pago
    const mpItems = items.map((item: any) => {
      const unitPrice = Number(item.subtotal) / Number(item.qty);
      return {
        id: String(item.product_id),
        title: item.product_title,
        description: item.addons && item.addons.length > 0 
          ? `+ ${item.addons.map((a:any) => a.title).join(', ')}` 
          : 'Produto regular',
        quantity: Number(item.qty),
        currency_id: 'BRL',
        unit_price: Number(unitPrice.toFixed(2))
      };
    });

    if (order.delivery_fee && Number(order.delivery_fee) > 0) {
      mpItems.push({
        id: 'delivery',
        title: 'Taxa de Entrega',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(order.delivery_fee)
      });
    }

    // Define a URL de retorno. Se o frontend mandou, usa ela. Senão, fallback.
    const SITE_URL = return_url || "http://localhost:3000";

    // 4. Cria Preferência
    const preferenceBody = {
      items: mpItems,
      payer: {
        name: order.customer_name || "Cliente",
      },
      external_reference: String(order.id),
      back_urls: {
        success: `${SITE_URL}?status=success`,
        failure: `${SITE_URL}?status=failure`,
        pending: `${SITE_URL}?status=pending`
      },
      auto_return: "approved"
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceBody)
    });

    const preference = await response.json();

    if (!response.ok) {
      throw new Error(preference.message || "Erro na API do Mercado Pago");
    }

    // 5. Retorna sucesso com links (Sandbox e Produção)
    return new Response(
      JSON.stringify({ 
        init_point: preference.init_point, 
        sandbox_init_point: preference.sandbox_init_point 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    // Retorna erro 400 para o Frontend saber que falhou e usar o Fallback
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
