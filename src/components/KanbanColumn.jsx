import React from 'react';
import OrderCard from './OrderCard';

// Terima prop 'onUpdateStatus'
const KanbanColumn = ({ id, title, orders, onUpdateStatus }) => {
  // Tentukan warna header berdasarkan status (Opsional, biar cantik)
  const getHeaderColor = () => {
    switch (id) {
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'READY': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Kolom */}
      <div className={`p-4 border-b font-bold flex justify-between items-center ${getHeaderColor()}`}>
        <h2>{title}</h2>
        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-extrabold shadow-sm bg-opacity-60">
          {orders.length}
        </span>
      </div>

      {/* Area Kartu */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[500px]">
        {orders.length === 0 ? (
           <div className="text-center text-gray-400 py-10 text-sm italic">
             Belum ada pesanan
           </div>
        ) : (
          orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              // TERUSKAN props ini ke OrderCard
              onUpdateStatus={onUpdateStatus} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;