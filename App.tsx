import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Star, Utensils, MessageCircle, X, Lock } from 'lucide-react';
import { AVAILABLE_ADDONS, MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Addon } from './types';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './services/supabase';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // App States
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modal State for Product Options
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempAddons, setTempAddons] = useState<Addon[]>([]);
  const [tempQty, setTempQty] = useState(1);
  const [tempSpoon, setTempSpoon] = useState(true);

  // Fetch Products from Supabase on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0 && !error) {
          setProducts(data);
        }
      } catch (e) {
        console.log('Using mock data due to connection error or missing config');
      }
    };
    fetchProducts();
  }, []);

  // --- Cart Logic ---
  const handleOpenAdd = (product: Product) => {
    setSelectedProduct(product);
    setTempAddons([]);
    setTempQty(1);
    setTempSpoon(true);
  };

  const toggleAddon = (addon: Addon) => {
    if (tempAddons.find(a => a.id === addon.id)) {
      setTempAddons(tempAddons.filter(a => a.id !== addon.id));
    } else {
      setTempAddons([...tempAddons, addon]);
    }
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    const newItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      product: selectedProduct,
      qty: tempQty,
      selectedAddons: tempAddons,
      needSpoon: tempSpoon
    };
    setCart([...cart, newItem]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // If Admin Mode is active, show the Kitchen Panel
  if (isAdminMode) {
    return <AdminPanel onBack={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-200">
              AT
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Açaí da Tati</h1>
              <p className="text-xs text-brand-600 font-medium">Delivery Premium</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingBag className="text-gray-700" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION - Updated Image */}
      <section className="relative h-72 md:h-96 bg-brand-900 overflow-hidden">
        <img 
          src="https://vtdmsvwuhvjpzjlvkmpc.supabase.co/storage/v1/object/public/Acai%20da%20Tati/Gemini_Generated_Image_5gbn8a5gbn8a5gbn.png" 
          alt="Vários copos de Açaí" 
          className="w-full h-full object-cover opacity-80"
          style={{ objectPosition: 'center 60%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center max-w-5xl mx-auto px-4">
          <div className="max-w-lg text-white animate-slideInLeft drop-shadow-lg">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs mb-4 border border-white/30 font-semibold shadow-sm">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span>O melhor da região</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Açaí <br/>da Tati.
            </h2>
            <p className="text-white/90 text-lg mb-8 font-medium max-w-sm">
              Monte seu copo!
            </p>
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({behavior: 'smooth'})}
              className="bg-white text-brand-800 px-8 py-4 rounded-2xl font-bold hover:bg-brand-50 transition shadow-xl shadow-black/10 flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
            >
              Fazer Pedido <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* MENU GRID */}
      <main id="menu" className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-brand-500 pl-4">Nossas Delícias</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={handleOpenAdd} 
            />
          ))}
        </div>
      </main>

      {/* PRODUCT OPTIONS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
            
            <div className="h-40 bg-gray-100 relative">
              <img src={selectedProduct.image_url} alt="" className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h3>
                <span className="text-xl font-bold text-brand-600">
                  R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{selectedProduct.description}</p>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Turbine seu Açaí</h4>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map(addon => {
                    const isSelected = tempAddons.some(a => a.id === addon.id);
                    return (
                      <label 
                        key={addon.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                            checked={isSelected}
                            onChange={() => toggleAddon(addon)}
                          />
                          <span className="text-gray-700 font-medium">{addon.title}</span>
                        </div>
                        <span className="text-sm font-semibold text-brand-600">
                          {addon.price === 0 ? 'Grátis' : `+ R$ ${addon.price.toFixed(2).replace('.', ',')}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Spoon/Utensils Option */}
              <div className="mb-6">
                 <h4 className="font-semibold text-gray-700 mb-3">Utensílios</h4>
                 <label 
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${tempSpoon ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                        checked={tempSpoon}
                        onChange={() => setTempSpoon(!tempSpoon)}
                      />
                      <div className="flex items-center gap-2">
                        <Utensils size={18} className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Enviar colherzinha?</span>
                      </div>
                    </div>
                  </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => setTempQty(Math.max(1, tempQty - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >-</button>
                  <span className="px-3 py-2 font-bold text-gray-800 w-10 text-center">{tempQty}</span>
                  <button 
                    onClick={() => setTempQty(tempQty + 1)}
                    className="px-3 py-2 text-brand-600 hover:bg-gray-100 font-bold"
                  >+</button>
                </div>
                <button 
                  onClick={confirmAddToCart}
                  className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition"
                >
                  Adicionar • R$ {((selectedProduct.price + tempAddons.reduce((s, a) => s + a.price, 0)) * tempQty).toFixed(2).replace('.', ',')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart}
        onClear={() => setCart([])}
      />
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-sm py-8 border-t bg-gray-50">
        <p>© 2024 Açaí da Tati. Todos os direitos reservados.</p>
        <button 
          onClick={() => setIsAdminMode(true)}
          className="mt-4 flex items-center justify-center gap-1 mx-auto text-gray-300 hover:text-brand-600 text-xs transition"
        >
          <Lock size={12} /> Área da Loja
        </button>
      </footer>
    </div>
  );
}

// Simple Icon helper for the modal
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default App;