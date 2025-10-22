import React from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import OrderCard from './OrderCard';

const KanbanColumn = ({ id, title, orders }) => {
  // `useSortable` di sini membuat kolom itu sendiri menjadi "droppable"
  const { setNodeRef } = useSortable({ id });

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col min-h-[200px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
          {orders.length}
        </span>
      </div>
      {/* SortableContext menyediakan konteks untuk item-item di dalamnya (OrderCard).
        Ini memberitahu dnd-kit bahwa item-item di dalam sini bisa diurutkan/dipindah.
      */}
      <SortableContext id={id} items={orders} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-grow space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;

