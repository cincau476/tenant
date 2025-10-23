import React, { useState, useEffect } from 'react'; // <-- Tambah useEffect
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// ... (impor dnd-kit lainnya)
import KanbanColumn from '../components/KanbanColumn';
import { getOrders, updateOrderStatus } from '../api/apiService'; // <-- Impor API

// Hapus 'initialColumns' yang lama

// Buat struktur kolom yang kosong sebagai state awal
const emptyColumns = {
  'PAID': { // <-- Gunakan status backend sebagai 'id'
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
// Backend: { uuid: '...', references_code: 'KNT-...', ... }
// Frontend: { id: '...', ... }
const formatOrderForKanban = (order) => {
  return {
    ...order,
    id: order.uuid, // <-- PENTING: Gunakan 'uuid' untuk ID dnd-kit
  };
};

const OrderManagement = () => {
  const [columns, setColumns] = useState(emptyColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // --- Langkah 1: Ambil data saat komponen dimuat ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders();
        
        // Data dari API adalah array flat, misal: [order1, order2, ...]
        // Kita perlu memilahnya ke dalam kolom
        const sortedColumns = { ...emptyColumns };
        
        response.data.forEach(order => {
          // Hanya tampilkan order yang relevan untuk Kanban
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
  }, []); // <-- [] berarti hanya jalan sekali saat mount

  // --- Langkah 2: Tambahkan Panggilan API ke handleDragEnd ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    
    // 'active.id' adalah 'uuid' dari order yang digeser
    const orderUuid = active.id; 
    
    // ID kontainer adalah status (misal: 'PAID', 'PROCESSING')
    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      
      // 'overContainer' adalah status baru, misal: 'PROCESSING'
      const newStatus = overContainer; 

      // Optimistic Update: Update UI langsung
      setColumns((prev) => {
        const activeItems = prev[activeContainer].orders;
        const overItems = prev[overContainer].orders;

        const activeIndex = activeItems.findIndex(item => item.id === orderUuid);
        const [movedItem] = activeItems.splice(activeIndex, 1);
        
        // Update status item yang dipindah (di state lokal)
        movedItem.status = newStatus;

        const overIndex = over.id in prev ? overItems.length : overItems.findIndex(item => item.id === over.id);

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
          // Sukses! Data di backend sudah cocok dengan di UI
          console.log('Update status berhasil:', response.data);
        })
        .catch(err => {
          // Gagal! Tampilkan error dan (idealnya) kembalikan kartu ke posisi semula
          console.error('Update status GAGAL:', err);
          setError(`Gagal mengupdate order ${orderUuid}. Coba refresh.`);
          // TODO: Implement "revert state" jika API gagal
        });
    }
  };

  // --- Langkah 3: Tampilkan status Loading/Error ---
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

  // --- Render Kanban Board ---
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
                id={column.id} // <-- 'id' sekarang 'PAID', 'PROCESSING', dll.
                title={column.title} 
                orders={column.orders} // <-- 'orders' berisi data dari backend
             />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default OrderManagement;