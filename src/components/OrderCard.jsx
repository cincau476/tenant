import React from 'react';
import { Clock } from 'lucide-react';

// Helper timeAgo
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

const OrderCard = ({ order, onUpdateStatus }) => {
  
  const getButtonAction = (status) => {
    switch (status) {
      case 'PAID':
        return { text: 'Proses Pesanan', class: 'bg-blue-600 hover:bg-blue-700' };
      case 'PROCESSING':
        return { text: 'Tandai Siap', class: 'bg-yellow-500 hover:bg-yellow-600' };
      case 'READY':
        return { text: 'Selesaikan', class: 'bg-green-600 hover:bg-green-700' };
      default:
        return null;
    }
  };
  
  const actionButton = getButtonAction(order.status);
  const isDineIn = order.order_type === 'DINE_IN';
  
  // Status berikutnya
  const NEXT_STATUS = {
    'PAID': 'PROCESSING',
    'PROCESSING': 'READY',
    'READY': 'COMPLETED'
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // Mencegah event bubbling jika ada
    const nextStatus = NEXT_STATUS[order.status];
    if (nextStatus && onUpdateStatus) {
      onUpdateStatus(order, nextStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow">
        {/* Header Kartu */}
        <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-gray-800 text-sm">{order.references_code}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1.5" />
                <span>{timeAgo(order.created_at)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${isDineIn ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                 {isDineIn ? 'Dine-In' : 'Takeaway'}
               </span>
               <span className="text-xs font-bold text-gray-800">{order.customer_name || 'Pelanggan'}</span>
            </div>
        </div>
          
        {/* List Item */}
        <div className="border-t border-dashed pt-2 space-y-1">
            {order.items.map((item, index) => (
              <div key={item.id || index} className="flex justify-between items-start text-sm text-gray-600">
                <div className="flex-1 pr-2">
                    {/* PERBAIKAN UTAMA: Pastikan mengakses .name */}
                    <span className="font-medium text-gray-800">
                      {item.menu_item?.name || item.menu_item_name || 'Item dihapus'}
                    </span> 
                    {/* Tampilkan varian jika ada (opsional) */}
                    {item.variant_info && (
                      <div className="text-xs text-gray-400 italic">
                        {item.variant_info}
                      </div>
                    )}
                    {item.note && (
                       <div className="text-[10px] text-red-400">Catatan: {item.note}</div>
                    )}
                </div>
                <div className="text-right whitespace-nowrap">
                   <span className="text-gray-500 text-xs mr-1">x{item.qty}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Total & Action */}
        <div className="mt-3 pt-2 border-t flex justify-between items-center">
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-bold text-gray-900">
              Rp {parseFloat(order.total).toLocaleString('id-ID')}
            </div>
        </div>

        {actionButton && (
             <button 
              onClick={handleActionClick}
              className={`w-full mt-3 text-white text-sm font-semibold py-2 rounded shadow-sm transition-colors duration-200 ${actionButton.class}`}
            >
                {actionButton.text}
             </button>
        )}
    </div>
  );
};

export default OrderCard;