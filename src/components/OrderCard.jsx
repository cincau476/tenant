import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock } from 'lucide-react';

// --- TAMBAHKAN FUNGSI HELPER INI ---
// Helper untuk mengubah string ISO (created_at) menjadi "X menit lalu"
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = new Date() - date;
  const diffMins = Math.round(diffMs / 60000); // menit

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} hari lalu`;
};
// --- AKHIR TAMBAHAN ---


const OrderCard = ({ order }) => {
  // Hook useSortable membuat komponen ini "draggable"
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  // Logika tombol ini sudah benar, akan berfungsi otomatis
  const getButtonAction = (status) => {
    switch (status) {
      case 'PAID':
        return { text: 'Proses Pesanan', class: 'bg-blue-600 hover:bg-blue-700' };
      case 'PROCESSING':
        return { text: 'Tandai Siap', class: 'bg-blue-600 hover:bg-blue-700' };
      case 'READY':
        return { text: 'Selesaikan', class: 'bg-gray-300 hover:bg-gray-400 text-gray-800' };
      default:
        return null;
    }
  };
  
  const actionButton = getButtonAction(order.status);
  
  // Tentukan tipe order dari backend (DINE_IN / TAKEAWAY)
  const isDineIn = order.order_type === 'DINE_IN';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 touch-none ${isDragging ? 'shadow-lg' : ''}`}
    >
        <div className="flex justify-between items-start">
            <div>
              {/* GANTI: Tampilkan references_code, bukan UUID */}
              <p className="font-bold text-gray-800">{order.references_code}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1.5" />
                {/* GANTI: Tampilkan waktu dari created_at */}
                <span>{timeAgo(order.created_at)}</span>
              </div>
            </div>
            {/* GANTI: Gunakan order.order_type */}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isDineIn ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              {isDineIn ? 'Dine-In' : 'Takeaway'}
            </span>
          </div>
          
          <div className="mt-4 border-t pt-3">
            {/* 'order.items' dari API sudah benar */}
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm text-gray-600 mb-1">
                {/* GANTI: 'item.name' -> 'item.menu_item.name' */}
                <span>{item.menu_item.name} <span className="text-gray-400">x{item.qty}</span></span>
                
                {/* 'item.price' sudah benar (ini adalah harga final per item) */}
                <span className="font-medium">Rp {(item.price).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3 border-t pt-3">
            <span className="font-semibold text-gray-800">Total</span>
            {/* 'order.total' sudah benar */}
            <span className="font-bold text-lg text-gray-900">Rp {order.total.toLocaleString('id-ID')}</span>
          </div>

          {/* Tombol ini akan tampil/sembunyi berdasarkan status asli */}
          {actionButton && (
             <button className={`w-full mt-4 text-white font-semibold py-2 rounded-lg transition-colors duration-200 ${actionButton.class}`}>
                {actionButton.text}
             </button>
          )}
    </div>
  );
};

export default OrderCard;