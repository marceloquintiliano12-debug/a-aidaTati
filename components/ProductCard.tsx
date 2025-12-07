import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="h-48 overflow-hidden relative group">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-md">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg">{product.title}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>
        
        <button 
          onClick={() => onAdd(product)}
          className="w-full mt-auto bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Plus size={18} />
          Adicionar
        </button>
      </div>
    </div>
  );
};