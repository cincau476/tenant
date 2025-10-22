import React from 'react';

// Data dummy/mock, nantinya ini akan diambil dari API
const orders = [
  { id: '#12345', name: 'Nasi Goreng Spesial', time: '5 menit lalu', status: 'Diproses', price: 'Rp 25.000' },
  { id: '#12344', name: 'Mie Ayam Bakso', time: '12 menit lalu', status: 'Selesai', price: 'Rp 18.000' },
  { id: '#12343', name: 'Es Teh Manis', time: '15 menit lalu', status: 'Selesai', price: 'Rp 5.000' },
  { id: '#12342', name: 'Soto Ayam', time: '25 menit lalu', status: 'Diproses', price: 'Rp 15.000' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Diproses: 'bg-orange-100 text-orange-600',
    Selesai: 'bg-green-100 text-green-600',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};


const RecentOrders = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Pesanan Terbaru</h3>
      <p className="text-sm text-gray-500">Daftar pesanan yang baru masuk dan sedang diproses</p>
      <div className="mt-4 space-y-4">
        {orders.map(order => (
          <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 text-xs">
                    {order.id.substring(1,3)}
                </div>
                <div className="ml-4">
                    <p className="font-semibold text-gray-800">{order.id} {order.name}</p>
                    <p className="text-sm text-gray-500">{order.time}</p>
                </div>
            </div>
            <div className="text-right">
                <StatusBadge status={order.status} />
                <p className="font-semibold text-gray-800 mt-1">{order.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
