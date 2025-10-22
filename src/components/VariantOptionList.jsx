import React from 'react';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';

const VariantOptionList = ({ group }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Opsi untuk {group.name}</h2>
        <button className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Tambah Opsi Baru
        </button>
      </div>
      <div className="space-y-3">
        {group.options.map(option => (
          <div key={option.id} className="flex items-center bg-gray-50 p-3 rounded-lg border">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{option.name}</p>
              <p className="text-sm text-gray-500">
                {option.price === 0
                  ? 'Tanpa biaya tambahan'
                  : `+ Rp ${option.price.toLocaleString('id-ID')}`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                <Edit size={18} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                <Copy size={18} />
              </button>
              <button className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantOptionList;
