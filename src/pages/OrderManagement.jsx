import React, { useState, useEffect } from 'react';
// HAPUS SEMUA impor 'dnd-kit'
import KanbanColumn from '../components/KanbanColumn';
import { getOrders, updateOrderStatus } from '../api/apiService';

// Struktur kolom kosong (tidak berubah)
const emptyColumns = {
  'PAID': { id: 'PAID', title: 'Pesanan Baru', status: 'PAID', orders: [], },
  'PROCESSING': { id: 'PROCESSING', title: 'Sedang Diproses', status: 'PROCESSING', orders: [], },
  'READY': { id: 'READY', title: 'Siap Diambil', status: 'READY', orders: [], },
  'COMPLETED': { id: 'COMPLETED', title: 'Selesai', status: 'COMPLETED', orders: [], },
};

// Fungsi helper (tidak berubah)
const formatOrderForKanban = (order) => {
  return { ...order, id: order.uuid };
};

const OrderManagement = () => {
  const [columns, setColumns] = useState(emptyColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // HAPUS: const sensors = useSensors(useSensor(PointerSensor));

  // --- Langkah 1: Ambil data (Tidak berubah) ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders();
        
        // --- Perbaikan Anti-Duplikat Anda (Sangat Penting) ---
        // Ini mengatasi masalah kartu duplikat yang Anda lihat di screenshot
        const rawOrders = response.data;
        const uniqueOrders = Array.from(new Map(rawOrders.map(order => [order.uuid, order])).values());
        
        const sortedColumns = { ...emptyColumns };
        
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

  // --- HAPUS: Seluruh fungsi handleDragEnd ---

  // --- TAMBAHKAN: Fungsi baru untuk menangani klik tombol ---
  const handleUpdateStatus = (orderToUpdate, newStatus) => {
    // 1. Optimistic Update UI (Pindahkan kartu)
    setColumns((prev) => {
      const newColumns = JSON.parse(JSON.stringify(prev)); // Deep copy
      const currentStatus = orderToUpdate.status;

      // Hapus dari kolom lama
      if (newColumns[currentStatus]) {
         newColumns[currentStatus].orders = newColumns[currentStatus].orders.filter(o => o.id !== orderToUpdate.id);
      }
     
      // Tambah ke kolom baru
      const updatedOrder = { ...orderToUpdate, status: newStatus };
      if (newColumns[newStatus]) {
        // Tambahkan di urutan paling atas (atau 'push' untuk di bawah)
        newColumns[newStatus].orders.unshift(updatedOrder);
      }
      
      return newColumns;
    });

    // 2. Panggil API di backend
    updateOrderStatus(orderToUpdate.uuid, newStatus)
      .then(response => {
        console.log('Update status berhasil:', response.data);
      })
      .catch(err => {
        console.error('Update status GAGAL:', err);
        setError(`Gagal mengupdate order ${orderToUpdate.uuid}. Coba refresh.`);
        // TODO: Implement "revert state" jika API gagal
      });
  };

  // --- (Sisa kode loading, error) ---
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
      
      {/* --- HAPUS Wrapper <DndContext> --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 items-start">
        {Object.values(columns).map((column) => (
           <KanbanColumn 
              key={column.id} 
              id={column.id}
              title={column.title} 
              orders={column.orders}
              // --- TAMBAHKAN Prop ini ---
              onUpdateStatus={handleUpdateStatus}
           />
        ))}
      </div>
      {/* --- HAPUS Wrapper </DndContext> --- */}
    </div>
  );
};

export default OrderManagement;