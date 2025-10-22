import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock } from 'lucide-react';

const OrderCard = ({ order }) => {
  // Hook useSortable membuat komponen ini "draggable"
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
  };

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
              <p className="font-bold text-gray-800">{order.id}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1.5" />
                <span>{order.time}</span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.type === 'Dine-In' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              {order.type}
            </span>
          </div>
          
          <div className="mt-4 border-t pt-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                <span className="font-medium">Rp {(item.price).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3 border-t pt-3">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-lg text-gray-900">Rp {order.total.toLocaleString('id-ID')}</span>
          </div>

          {actionButton && (
             <button className={`w-full mt-4 text-white font-semibold py-2 rounded-lg transition-colors duration-200 ${actionButton.class}`}>
                {actionButton.text}
             </button>
          )}
    </div>
  );
};

export default OrderCard;

