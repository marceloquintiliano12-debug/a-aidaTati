
 import { Order, CheckoutResponse } from '../types';
import { supabase } from './supabase';
import { MERCADO_PAGO_LINK } from '../constants';

export const processCheckout = async (order: Order): Promise<CheckoutResponse> => {
  let savedOrderData: any = null;
  try {
    const payload = {
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      delivery_type: order.delivery_type,
      address: order.address || null,
      change_for: order.change_for || null,
      delivery_fee: order.delivery_fee || 0,
      items: order.items,
      status: 'pending'
    };
    const { data, error } = await supabase.from('orders').insert([payload]).select().single();
    if (error) savedOrderData = { id: 'LOCAL-' + Date.now().toString().slice(-6), ...payload };
    else savedOrderData = data;
  } catch (err) { savedOrderData = { id: 'ERR-' + Date.now().toString().slice(-6) }; }

  if (order.payment_method === 'money') return { success: true, orderId: savedOrderData.id };
  return { success: true, orderId: savedOrderData.id, checkoutUrl: MERCADO_PAGO_LINK };
};
