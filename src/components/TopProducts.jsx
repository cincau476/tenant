import React from 'react';

/**
 * Komponen ini menggantikan RecentOrders untuk menampilkan
 * data 'top_selling_products' yang disediakan oleh API /reports/summary/.
 */
const TopProducts = ({ productsData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
      <p className="text-sm text-gray-500">Daftar produk yang paling banyak terjual hari ini</p>
      <div className="mt-4 space-y-4">
        
        {/* Tampilkan pesan jika tidak ada data */}
        {(!productsData || productsData.length === 0) ? (
          <p className="text-gray-500 text-center py-4">Belum ada data penjualan.</p>
        ) : (
          productsData.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                      #{index + 1}
                  </div>
                  <div className="ml-4">
                      {/* API mengembalikan 'menu_item__name' */}
                      <p className="font-semibold text-gray-800">{product.menu_item__name}</p>
                      {/* API mengembalikan 'total_sold' */}
                      <p className="text-sm text-gray-500">Terjual: {product.total_sold} porsi</p>
                  </div>
              </div>
              <div className="text-right">
                  {/* API mengembalikan 'total_revenue' */}
                  <p className="font-semibold text-gray-800">
                    Rp {Number(product.total_revenue).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Total Pendapatan</p>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default TopProducts;