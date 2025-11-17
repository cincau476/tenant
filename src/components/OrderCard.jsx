import React from 'react';
// HAPUS: impor 'dnd-kit'
import { Clock } from 'lucide-react';

// Helper timeAgo (tidak berubah)
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


// TAMBAHKAN: 'onUpdateStatus' di props
const OrderCard = ({ order, onUpdateStatus }) => {
  // HAPUS: Hook 'useSortable'
  // HAPUS: const style = { ... }

  // Fungsi getButtonAction (tidak berubah)
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
  
  // Logika isDineIn (tidak berubah)
  const isDineIn = order.order_type === 'DINE_IN';
  
  // --- TAMBAHKAN: Map untuk status berikutnya ---
  const NEXT_STATUS = {
    'PAID': 'PROCESSING',
    'PROCESSING': 'READY',
    'READY': 'COMPLETED'
  };

  // --- TAMBAHKAN: Handler untuk klik tombol ---
  const handleActionClick = () => {
    const nextStatus = NEXT_STATUS[order.status];
    if (nextStatus && onUpdateStatus) {
      // Kirim order dan status baru ke parent (OrderManagement.jsx)
      onUpdateStatus(order, nextStatus);
    }
  };

  return (
    <div
      // HAPUS: ref, style, attributes, listeners
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200`}
    >
        <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-800">{order.references_code}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1.5" />
                <span>{timeAgo(order.created_at)}</span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isDineIn ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              {isDineIn ? 'Dine-In' : 'Takeaway'}
            </span>
          </div>
          
          <div className="mt-4 border-t pt-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>{item.menu_item.name} <span className="text-gray-400">x{item.qty}</span></span>
                <span className="font-medium">Rp {(item.price).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3 border-t pt-3">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-lg text-gray-900">Rp {order.total.toLocaleString('id-ID')}</span>
          </div>

          {/* --- UPDATE Tombol --- */}
          {actionButton && (
             <button 
              // TAMBAHKAN: onClick handler
              onClick={handleActionClick}
              className={`w-full mt-4 text-white font-semibold py-2 rounded-lg transition-colors duration-200 ${actionButton.class}`}
            >
                {actionButton.text}
             </button>
          )}
    </div>
  );
};

export default OrderCard;