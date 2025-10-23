import React from 'react';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';

// <-- Tambahkan prop onAddOption & onDeleteOption
const VariantOptionList = ({ group, onAddOption, onDeleteOption }) => {
  
  const handleDelete = (optionId) => {
    if (window.confirm('Yakin ingin menghapus opsi ini?')) {
      onDeleteOption(optionId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Opsi untuk {group.name}</h2>
        {/* Sambungkan tombol 'onClick' */}
        <button 
          onClick={onAddOption}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
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
                {Number(option.price) === 0
                  ? 'Tanpa biaya tambahan'
                  : `+ Rp ${Number(option.price).toLocaleString('id-ID')}`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                <Edit size={18} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                <Copy size={18} />
              </button>
              {/* Sambungkan tombol 'onClick' */}
              <button 
                onClick={() => handleDelete(option.id)}
                className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {/* Tampilkan pesan jika tidak ada opsi */}
        {group.options.length === 0 && (
          <p className="text-center text-gray-500 py-4">Belum ada opsi untuk grup ini.</p>
        )}
      </div>
    </div>
  );
};

export default VariantOptionList;