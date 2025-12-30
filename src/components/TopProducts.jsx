// src/components/TopProducts.jsx
import React from 'react';

export default function TopProducts({ productsData }) {
  if (!productsData || productsData.length === 0) {
    return <p className="text-gray-500 text-center py-4">Belum ada data penjualan.</p>;
  }

  return (
    <div className="space-y-4">
      {productsData.map((product, index) => (
        <div 
          key={index} 
          className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-50/50 to-transparent border border-orange-100 hover:border-orange-300 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform ${
              index === 0 ? 'bg-orange-500' : index === 1 ? 'bg-amber-500' : 'bg-slate-400'
            }`}>
              {index + 1}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 group-hover:text-orange-700 transition-colors">{product.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{product.category_name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-gray-900 leading-none">{product.total_sold}</p>
            <p className="text-[10px] uppercase font-bold text-orange-600">Terjual</p>
          </div>
        </div>
      ))}
    </div>
  );
}
