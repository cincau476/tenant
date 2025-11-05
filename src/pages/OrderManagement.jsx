import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'; // Tambahkan impor
import KanbanColumn from '../components/KanbanColumn';
import { getOrders, updateOrderStatus } from '../api/apiService';

// Struktur kolom kosong
const emptyColumns = {
  'PAID': {
    id: 'PAID',
    title: 'Pesanan Baru',
    status: 'PAID',
    orders: [],
  },
  'PROCESSING': {
    id: 'PROCESSING',
    title: 'Sedang Diproses',
    status: 'PROCESSING',
    orders: [],
  },
  'READY': {
    id: 'READY',
    title: 'Siap Diambil',
    status: 'READY',
    orders: [],
  },
  'COMPLETED': {
    id: 'COMPLETED',
    title: 'Selesai',
    status: 'COMPLETED',
    orders: [],
  },
};

// Fungsi helper untuk memformat item
const formatOrderForKanban = (order) => {
  return {
    ...order,
    id: order.uuid, // Gunakan 'uuid' untuk ID dnd-kit
  };
};

const OrderManagement = () => {
  const [columns, setColumns] = useState(emptyColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // --- Langkah 1: Ambil data dan PAKSA UNIK ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders();
        
        // --- PERBAIKAN 1: ANTI-DUPLIKAT ---
        // 1. Ambil data mentah (yang mungkin duplikat dari backend)
        const rawOrders = response.data;
        // 2. Buat versi unik secara paksa menggunakan Map berdasarkan UUID
        const uniqueOrders = Array.from(new Map(rawOrders.map(order => [order.uuid, order])).values());
        // --- AKHIR PERBAIKAN 1 ---

        // Kita perlu memilahnya ke dalam kolom
        const sortedColumns = { ...emptyColumns };
        
        // 3. Gunakan 'uniqueOrders' (BUKAN 'response.data') untuk memproses
        uniqueOrders.forEach(order => {
          if (order.status in sortedColumns) {
            sortedColumns[order.status].orders.push(formatOrderForKanban(order));
          }
        });

        setColumns(sortedColumns);
        setError(null);
      } catch (err) {
        setError('Gagal memuat pesanan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- Langkah 2: Perbaiki handleDragEnd ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    
    const orderUuid = active.id; 
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      
      const newStatus = overContainer; 

      // Optimistic Update
      setColumns((prev) => {
        // --- PERBAIKAN 2: PENCEGAH CRASH ---
        // Cek jika 'overContainer' (tujuan) adalah kolom yang valid (ada di 'prev')
        // Ini mencegah error "Cannot read properties of undefined (reading 'orders')"
        if (!prev[overContainer]) {
          console.warn(`Drop target tidak valid: ${overContainer}`);
          return prev; // Batalkan update, jangan lakukan apa-apa
        }
        // --- AKHIR PERBAIKAN 2 ---

        const activeItems = prev[activeContainer].orders;
        const overItems = prev[overContainer].orders;

        const activeIndex = activeItems.findIndex(item => item.id === orderUuid);
        const [movedItem] = activeItems.splice(activeIndex, 1);
        
        movedItem.status = newStatus;

        // Tentukan index baru
        const overIndex = over.id in prev 
          ? overItems.length // Jika drop di kolom
          : overItems.findIndex(item => item.id === over.id); // Jika drop di atas kartu lain

        overItems.splice(overIndex, 0, movedItem);
        
        return {
          ...prev,
          [activeContainer]: { ...prev[activeContainer], orders: [...activeItems] },
          [overContainer]: { ...prev[overContainer], orders: [...overItems] },
        };
      });

      // --- Kirim pembaruan status ke backend API ---
      console.log(`Mengirim update: Order ${orderUuid} -> Status ${newStatus}`);
      
      updateOrderStatus(orderUuid, newStatus)
        .then(response => {
          console.log('Update status berhasil:', response.data);
        })
        .catch(err => {
          console.error('Update status GAGAL:', err);
          setError(`Gagal mengupdate order ${orderUuid}. Coba refresh.`);
          // TODO: Implement "revert state" (mengembalikan kartu) jika API gagal
        });
    }
  };

  // --- (Sisa kode loading, error, dan render) ---
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Memuat data pesanan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
        <p className="text-gray-500 mt-1">Kelola pesanan yang masuk dengan menggunakan sistem Kanban</p>
      </header>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 items-start">
          {Object.values(columns).map((column) => (
             <KanbanColumn 
                key={column.id} 
                id={column.id}
                title={column.title} 
                orders={column.orders}
             />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default OrderManagement;