import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { Order } from '../types';
import { CheckCircle, Clock, MapPin, DollarSign, XCircle, ArrowLeft, Bell } from 'lucide-react';

// Som de notificação (base64 curto de um "ding")
const ALERT_SOUND = "data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7cV96+539Cw+g05PSZEdtmZj6gD5QODghD3f3//+4xAAAAAAAAAIiaJ46b0//uQRAAAAAAnM+5kAAAEJnM+5kAAAE/d7IfnwAAAT93sh+fAAAA4gAAAB5gAAABAgAAAB1gAAABlQAAAD3gAAAB3gAAABfgAAAB7gAAABJQAAABqQAAABEwAAABcQAAABNgAAAB3wAAABEwAAABsQAAAC8AAAAAAAD/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAAf/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AA//7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAP/7kEQAAAAAAAZD3uZC3gAAGQ97mQt4AAA==";

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializa o objeto de áudio
    audioRef.current = new Audio(ALERT_SOUND);

    fetchOrders();

    // Configura o Realtime do Supabase
    const channel = supabase
      .channel('orders-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Novo pedido recebido!', payload);
          // Adiciona o novo pedido ao topo da lista
          setOrders((prev) => [payload.new, ...prev]);
          // Toca o som
          playAlert();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playAlert = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Interação do usuário necessária para tocar áudio"));
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    // Busca pedidos pendentes ordenados por data (mais recente primeiro)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .neq('status', 'completed') // Não mostra os concluídos
      .limit(50);

    if (error) console.error(error);
    else setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    // Atualiza otimista na UI
    setOrders(prev => prev.filter(o => o.id !== id));

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Erro ao atualizar status");
      fetchOrders(); // Reverte se der erro
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Cozinha / Pedidos</h1>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online • Aguardando pedidos
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">Nenhum pedido pendente</h2>
            <p className="text-gray-400">Novos pedidos aparecerão aqui automaticamente.</p>
            <button onClick={() => playAlert()} className="mt-4 text-xs text-brand-600 underline">Testar Som</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md border-l-4 border-brand-500 overflow-hidden animate-slideInRight">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">#{order.id.slice(0, 5).toUpperCase()}</h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> 
                      {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-brand-700">R$ {order.total_amount.toFixed(2).replace('.',',')}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 uppercase">
                      {order.payment_method}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2 mb-2 bg-blue-50 p-2 rounded text-blue-800 text-sm">
                    <div className="mt-0.5"><MapPin size={14} /></div>
                    <div>
                      <span className="font-bold">{order.delivery_type === 'delivery' ? 'ENTREGA' : 'RETIRADA'}</span>
                      {order.delivery_type === 'delivery' && (
                        <p className="text-xs mt-1 text-blue-700">{order.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-sm text-gray-800">
                        <div className="flex justify-between font-semibold">
                          <span>{item.qty}x {item.product_title}</span>
                        </div>
                        {item.addons && item.addons.length > 0 && (
                          <div className="text-xs text-gray-500 pl-4 border-l-2 border-gray-200 ml-1">
                            + {item.addons.map((a: any) => a.title).join(', ')}
                          </div>
                        )}
                        {!item.needSpoon && (
                           <div className="text-xs text-orange-600 font-bold pl-4 ml-1">🚫 SEM COLHER</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.change_for && (
                    <div className="text-sm bg-yellow-50 text-yellow-800 p-2 rounded flex items-center gap-2">
                      <DollarSign size={14} />
                      Troco para: <strong>{order.change_for}</strong>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 border-t pt-2">
                    Cliente: <strong>{order.customer_name}</strong>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 flex gap-2">
                  <button 
                    onClick={() => updateStatus(order.id, 'completed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle size={16} /> Pronto / Entregue
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'cancelled')}
                    className="px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};