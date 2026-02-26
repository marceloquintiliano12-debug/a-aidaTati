import React, { useState } from 'react';
import { CartItem, Addon, CheckoutResponse } from '../types';
import { X, Trash2, ShoppingBag, CreditCard, Banknote, QrCode, Copy, CheckCircle, Bike, Store, MapPin, MessageCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { processCheckout } from '../services/checkout';
import { STORE_WHATSAPP, DELIVERY_FEE, STORE_PIX_KEY, STORE_PIX_QR_IMAGE } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onClear: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onClear }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [payMethod, setPayMethod] = useState<'pix' | 'card' | 'money'>('pix');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [changeFor, setChangeFor] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [paymentConfirmedByUser, setPaymentConfirmedByUser] = useState(false);

  const deliveryCost = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const productsSubtotal = items.reduce((acc, item) => {
    const addonsTotal = item.selectedAddons.reduce((sum, add) => sum + add.price, 0);
    return acc + ((item.product.price + addonsTotal) * item.qty);
  }, 0);
  const total = productsSubtotal + deliveryCost;

  const copyPixToClipboard = () => {
    navigator.clipboard.writeText(STORE_PIX_KEY);
    alert(`Chave PIX copiada: ${STORE_PIX_KEY}`);
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) { alert('Por favor, digite seu nome.'); return; }
    if (!customerPhone.trim()) { alert('Por favor, digite seu telefone.'); return; }
    if (deliveryType === 'delivery' && !address.trim()) { alert('Por favor, digite o endereço.'); return; }
    
    setLoading(true);
    const orderData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      total_amount: total,
      payment_method: payMethod,
      delivery_type: deliveryType,
      delivery_fee: deliveryCost,
      address: deliveryType === 'delivery' ? address : undefined,
      change_for: payMethod === 'money' ? changeFor : undefined,
      items: items.map(i => ({
        product_id: i.product.id,
        product_title: i.product.title,
        qty: i.qty,
        addons: i.selectedAddons,
        needSpoon: i.needSpoon,
        subtotal: (i.product.price + i.selectedAddons.reduce((s,a)=>s+a.price,0)) * i.qty
      })),
      status: 'pending' as const
    };

    const res = await processCheckout(orderData);
    if (res.success) setResult(res);
    else alert(res.error || "Erro ao processar pedido");
    setLoading(false);
  };

  const resetCheckout = () => { setResult(null); setPaymentConfirmedByUser(false); onClose(); onClear(); };

  const sendToWhatsApp = () => {
    if (!result) return;
    let msg = `*🔔 NOVO PEDIDO #${result.orderId?.substring(0,8)}*\n`;
    msg += `👤 *Cliente:* ${customerName}\n`;
    msg += `📞 *Telefone:* ${customerPhone}\n`;
    msg += `--------------------------------\n`;
    items.forEach(item => {
      msg += `*${item.qty}x ${item.product.title}*\n`;
      if (item.selectedAddons.length > 0) msg += `   + ${item.selectedAddons.map(a => a.title).join(', ')}\n`;
      if (!item.needSpoon) msg += `   🚫 Sem colherzinha\n`;
      msg += `\n`;
    });
    msg += `--------------------------------\n`;
    msg += `🛵 *Tipo:* ${deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}\n`;
    if (deliveryType === 'delivery') msg += `📍 *Endereço:* ${address}\n`;
    const methodLabel = payMethod === 'pix' ? 'PIX' : payMethod === 'card' ? 'Cartão' : 'Dinheiro';
    msg += `💲 *Pagamento:* ${methodLabel}\n`;
    if (payMethod !== 'money') msg += `✅ *Status:* Pago Online\n`;
    else { if (changeFor) msg += `💵 *Troco para:* ${changeFor}\n`; msg += `⏳ *Status:* Pagar na entrega\n`; }
    msg += `💰 *Total Final:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
    const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
        <div className="p-5 border-b flex justify-between items-center bg-brand-50">
          <div className="flex items-center gap-2 text-brand-700"><ShoppingBag /><h2 className="font-bold text-xl">Seu Pedido</h2></div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {result?.success ? (
            <div className="flex flex-col items-center justify-start min-h-[50vh] text-center space-y-4 animate-fadeIn pt-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold text-gray-800">Pedido Criado!</h3>
              <p className="text-gray-500 text-sm mb-4">Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded font-bold text-gray-700">{result.orderId}</span></p>
              {payMethod !== 'money' && (
                <div className="w-full space-y-5">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Valor Total a Pagar</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-extrabold text-brand-700">R$ {total.toFixed(2).replace('.', ',')}</span>
                      <button onClick={() => { navigator.clipboard.writeText(total.toFixed(2).replace('.', ',')); alert('Valor copiado!'); }} className="p-2 bg-white rounded-full shadow border hover:bg-gray-100 text-brand-600 active:scale-90 transition-transform"><Copy size={20} /></button>
                    </div>
                  </div>
                  {payMethod === 'pix' && (
                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 w-full shadow-sm">
                      <p className="text-sm font-bold text-purple-900 mb-3 flex items-center justify-center gap-2"><QrCode size={18} /> Pagamento via PIX</p>
                      {STORE_PIX_QR_IMAGE && <div className="flex justify-center mb-4"><img src={STORE_PIX_QR_IMAGE} alt="QR Code PIX" className="w-48 h-48 rounded-lg shadow-md border-4 border-white" /></div>}
                      <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Chave PIX</p>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono break-all text-purple-700">{STORE_PIX_KEY}</code>
                          <button onClick={copyPixToClipboard} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"><Copy size={16} /></button>
                        </div>
                      </div>
                    </div>
                  )}
                  {payMethod === 'card' && result.checkoutUrl && (
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 w-full shadow-sm">
                      <a href={result.checkoutUrl} target="_blank" rel="noreferrer" className="block w-full bg-[#009EE3] hover:bg-[#008CC9] text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"><CreditCard size={20} /> Abrir Link Mercado Pago <ExternalLink size={16} /></a>
                    </div>
                  )}
                  {!paymentConfirmedByUser && (
                     <div className="w-full py-4 border-t border-dashed border-gray-300">
                        <button onClick={() => setPaymentConfirmedByUser(true)} className="w-full py-3 border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition">Sim, já paguei!</button>
                     </div>
                  )}
                </div>
              )}
              {(payMethod === 'money' || paymentConfirmedByUser) && (
                <div className="w-full bg-green-50 border border-green-200 p-5 rounded-xl shadow-sm animate-fadeIn">
                  <button onClick={sendToWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 text-lg"><MessageCircle size={24} fill="white" />{payMethod === 'money' ? 'Enviar Pedido no WhatsApp' : 'Enviar Comprovante no Zap'}</button>
                </div>
              )}
              <button onClick={resetCheckout} className="mt-8 text-gray-400 hover:text-brand-600 text-sm hover:underline">Fechar e Iniciar Novo Pedido</button>
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center text-gray-400 py-20 flex flex-col items-center"><ShoppingBag size={48} className="mb-4 opacity-20" /><p>Sua sacola está vazia.</p></div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cartId} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"><img src={item.product.image_url} className="w-full h-full object-cover" alt="" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start"><h4 className="font-semibold text-gray-800 text-sm">{item.product.title}</h4><button onClick={() => onRemove(item.cartId)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></div>
                        {item.selectedAddons.length > 0 && <p className="text-xs text-gray-500 mt-1">+ {item.selectedAddons.map(a => a.title).join(', ')}</p>}
                        {!item.needSpoon && <p className="text-xs text-orange-600 italic mt-1">Sem colherzinha</p>}
                        <div className="mt-2 flex justify-between items-center"><span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">x{item.qty}</span><span className="font-bold text-gray-800 text-sm">R$ {((item.product.price + item.selectedAddons.reduce((s,a)=>s+a.price,0)) * item.qty).toFixed(2).replace('.', ',')}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {items.length > 0 && (
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label><input type="text" placeholder="Ex: Neuza Maria" className="w-full p-3 border border-gray-200 rounded-xl outline-none" value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label><input type="tel" placeholder="(00) 00000-0000" className="w-full p-3 border border-gray-200 rounded-xl outline-none" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Entrega</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setDeliveryType('delivery')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${deliveryType === 'delivery' ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}><Bike size={18} />Entrega</button>
                      <button onClick={() => setDeliveryType('pickup')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${deliveryType === 'pickup' ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}><Store size={18} />Retirada</button>
                    </div>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="animate-fadeIn"><label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label><textarea placeholder="Rua, Número, Bairro..." className="w-full p-3 border border-gray-200 rounded-xl h-24 resize-none" value={address} onChange={e => setAddress(e.target.value)} /></div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setPayMethod('pix')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${payMethod === 'pix' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 hover:bg-gray-50'}`}><QrCode size={20} /><span className="text-xs font-semibold">Pix</span></button>
                      <button onClick={() => setPayMethod('card')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${payMethod === 'card' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 hover:bg-gray-50'}`}><CreditCard size={20} /><span className="text-xs font-semibold">Cartão</span></button>
                      <button onClick={() => setPayMethod('money')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${payMethod === 'money' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 hover:bg-gray-50'}`}><Banknote size={20} /><span className="text-xs font-semibold">Dinheiro</span></button>
                    </div>
                    {payMethod === 'money' && <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100 animate-fadeIn"><input type="text" placeholder="Troco para quanto?" className="w-full p-2 border border-yellow-200 rounded bg-white text-sm" value={changeFor} onChange={(e) => setChangeFor(e.target.value)} /></div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {!result?.success && items.length > 0 && (
          <div className="p-5 bg-white border-t space-y-4">
            <div className="flex justify-between items-center text-lg pt-2 border-t border-dashed"><span className="text-gray-800 font-medium">Total</span><span className="font-bold text-brand-800 text-xl">R$ {total.toFixed(2).replace('.', ',')}</span></div>
            <button onClick={handleCheckout} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${loading ? 'bg-gray-400' : 'bg-brand-600 hover:bg-brand-700'}`}>{loading ? 'Processando...' : 'Finalizar Pedido'}</button>
          </div>
        )}
      </div>
    </div>
  );
};
