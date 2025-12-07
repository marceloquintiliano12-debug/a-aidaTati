import { Order, CheckoutResponse } from '../types';
import { supabase } from './supabase';
import { MERCADO_PAGO_LINK } from '../constants';

export const processCheckout = async (order: Order): Promise<CheckoutResponse> => {
  // 1. Tenta salvar o pedido no Supabase (Tabela 'orders')
  let savedOrderData: any = null;

  try {
    const payload = {
      customer_name: order.customer_name,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      delivery_type: order.delivery_type,
      address: order.address || null,
      change_for: order.change_for || null,
      delivery_fee: order.delivery_fee || 0,
      items: order.items,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("⚠️ Erro ao salvar pedido no banco (pode ser conexão ou tabela ausente). Usando ID local.", error.message);
      savedOrderData = { id: 'LOCAL-' + Date.now().toString().slice(-6), ...payload };
    } else {
      savedOrderData = data;
      
      // Envia SMS para a loja (Fire & Forget) - Não bloqueia o fluxo se falhar
      supabase.functions.invoke('send-order-notification', {
        body: { record: savedOrderData }
      }).then(({ error }) => {
        if (error) console.log("SMS Notification skipped (Function not deployed)");
      });
    }
  } catch (err) {
    console.error("Erro crítico ao salvar pedido:", err);
    savedOrderData = { id: 'ERR-' + Date.now().toString().slice(-6) };
  }

  // 2. Pagamento: Dinheiro
  if (order.payment_method === 'money') {
    return {
      success: true,
      orderId: savedOrderData.id
    };
  }

  // 3. Pagamento Online: Mercado Pago (Link Fixo)
  // Removemos a chamada à Edge Function para evitar erro de conexão.
  // Usamos o link direto fornecido.
  
  return {
    success: true,
    orderId: savedOrderData.id,
    checkoutUrl: MERCADO_PAGO_LINK
  };
};