import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from '../components/KanbanColumn';

const initialColumns = {
  'new-orders': {
    id: 'new-orders',
    title: 'Pesanan Baru',
    status: 'PAID',
    orders: [
      { id: 'KNT-2025-001', time: '10:30', type: 'Dine-In', items: [{name: 'Nasi Goreng Spesial', qty: 2, price: 25000}, {name: 'Es Teh Manis', qty: 2, price: 5000}], total: 60000, status: 'PAID' },
      { id: 'KNT-2025-002', time: '10:35', type: 'Takeaway', items: [{name: 'Mie Ayam Bakso', qty: 1, price: 18000}], total: 18000, status: 'PAID' },
    ],
  },
  'processing': {
    id: 'processing',
    title: 'Sedang Diproses',
    status: 'PROCESSING',
    orders: [
      { id: 'KNT-2025-003', time: '10:25', type: 'Dine-In', items: [{name: 'Ayam Geprek + Nasi', qty: 1, price: 22000}, {name: 'Es Jeruk', qty: 1, price: 6000}], total: 28000, status: 'PROCESSING' },
      { id: 'KNT-2025-004', time: '10:20', type: 'Takeaway', items: [{name: 'Soto Ayam', qty: 1, price: 20000}], total: 20000, status: 'PROCESSING' },
    ],
  },
  'ready': {
    id: 'ready',
    title: 'Siap Diambil',
    status: 'READY',
    orders: [
      { id: 'KNT-2025-005', time: '10:15', type: 'Dine-In', items: [{name: 'Nasi Goreng Spesial', qty: 1, price: 25000}], total: 25000, status: 'READY' },
    ],
  },
  'completed': {
    id: 'completed',
    title: 'Selesai',
    status: 'COMPLETED',
    orders: [
        { id: 'KNT-2025-006', time: '10:05', type: 'Takeaway', items: [{name: 'Mie Ayam Bakso', qty: 2, price: 18000}, {name: 'Es Teh Manis', qty: 2, price: 5000}], total: 46000, status: 'COMPLETED' },
    ],
  },
};

const OrderManagement = () => {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setColumns((prev) => {
        const activeItems = prev[activeContainer].orders;
        const overItems = prev[overContainer].orders;

        const activeIndex = activeItems.findIndex(item => item.id === active.id);
        const [movedItem] = activeItems.splice(activeIndex, 1);
        
        // Update status item yang dipindah
        movedItem.status = prev[overContainer].status;

        const overIndex = over.id in prev ? overItems.length : overItems.findIndex(item => item.id === over.id);

        overItems.splice(overIndex, 0, movedItem);

        // TODO: Kirim pembaruan status ke backend API di sini
        console.log(`Order ${active.id} moved from ${prev[activeContainer].status} to ${prev[overContainer].status}`);
        
        return {
          ...prev,
          [activeContainer]: { ...prev[activeContainer], orders: activeItems },
          [overContainer]: { ...prev[overContainer], orders: overItems },
        };
      });
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
        <p className="text-gray-500 mt-1">Kelola pesanan yang masuk dengan menggunakan sistem Kanban</p>
      </header>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 items-start">
          {Object.values(columns).map((column) => (
             <KanbanColumn key={column.id} id={column.id} title={column.title} orders={column.orders} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default OrderManagement;

