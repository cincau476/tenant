import React from 'react';
// HAPUS: impor 'dnd-kit'
import OrderCard from './OrderCard';

// TAMBAHKAN: 'onUpdateStatus' di props
const KanbanColumn = ({ id, title, orders, onUpdateStatus }) => {
  // HAPUS: `useSortable`
  
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col min-h-[200px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
          {orders.length}
        </span>
      </div>
      
      {/* HAPUS: Wrapper <SortableContext> */}
      {/* HAPUS: ref={setNodeRef} */}
      <div className="flex-grow space-y-4">
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            // TAMBAHKAN: Teruskan prop
            onUpdateStatus={onUpdateStatus} 
          />
        ))}
      </div>
      {/* HAPUS: Wrapper </SortableContext> */}
    </div>
  );
};

export default KanbanColumn;