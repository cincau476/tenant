import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Edit, Trash2 } from 'lucide-react';

const MenuCard = ({ item, onAvailabilityChange }) => {
  const isOutOfStock = !item.available;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
      <div className="relative">
        <img
          className={`w-full h-48 object-cover ${isOutOfStock ? 'filter blur-sm' : ''}`}
          src={item.imageUrl}
          alt={item.name}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <span className="text-white text-2xl font-bold tracking-widest">HABIS</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-xl font-bold text-blue-600 mt-1">
          Rp {item.price.toLocaleString('id-ID')}
        </p>
        <p className="text-sm text-gray-500 mt-1">Stok: {item.stock}</p>
        
        <div className="mt-4 flex items-center justify-between">
            <span className={`text-sm font-medium ${item.available ? 'text-gray-700' : 'text-gray-400'}`}>
                {item.available ? 'Tersedia' : 'Habis'}
            </span>
            <ToggleSwitch 
                isOn={item.available}
                handleToggle={onAvailabilityChange}
            />
        </div>

        <div className="mt-4 pt-4 border-t flex items-center space-x-2">
            <button className="flex-1 flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors">
                <Edit size={16} className="mr-2"/>
                Edit
            </button>
            <button className="flex-1 flex items-center justify-center text-sm bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-lg transition-colors">
                <Trash2 size={16} className="mr-2"/>
                Hapus
            </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
