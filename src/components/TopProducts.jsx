// src/components/TopProducts.jsx
import React from 'react';

/**
 * Komponen ini menampilkan daftar produk terlaris berdasarkan data 'top_selling_products'
 * yang diterima dari dashboard.
 */
const TopProducts = ({ productsData }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white">Produk Terlaris</h3>
      <p className="text-sm text-gray-400">Daftar produk yang paling banyak terjual hari ini.</p>
      
      <div className="mt-4 space-y-4">
        {/* Validasi data: Tampilkan pesan jika tidak ada data atau produk kosong */}
        {(!productsData || productsData.length === 0) ? (
          <p className="text-gray-500 text-center py-4 italic">Belum ada data penjualan saat ini.</p>
        ) : (
          productsData.map((product, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-xl transition-colors border border-transparent hover:border-gray-600"
            >
              <div className="flex items-center">
                  {/* Indikator peringkat produk */}
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center font-bold text-orange-500 border border-orange-500/20">
                      #{index + 1}
                  </div>
                  <div className="ml-4">
                      {/* Nama produk dari field 'menu_item__name' */}
                      <p className="font-semibold text-white">{product.menu_item__name}</p>
                      {/* Jumlah terjual dari field 'total_sold' */}
                      <p className="text-sm text-gray-400">Terjual: {product.total_sold} porsi</p>
                  </div>
              </div>
              <div className="text-right">
                  {/* Total pendapatan dari field 'total_revenue' yang diformat ke Rupiah */}
                  <p className="font-semibold text-orange-400">
                    Rp {Number(product.total_revenue).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Total Omzet</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;
