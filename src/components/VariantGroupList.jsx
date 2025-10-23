import React from 'react';
import { Plus, Trash2 } from 'lucide-react'; // <-- Impor Trash2

// <-- Tambahkan prop onAddGroup & onDeleteGroup
const VariantGroupList = ({ groups, selectedGroupId, onSelectGroup, onAddGroup, onDeleteGroup }) => {
  
  const handleDelete = (e, groupId) => {
    e.stopPropagation(); // <-- Hentikan event agar tidak 'onSelectGroup'
    if (window.confirm('Yakin ingin menghapus grup ini? Semua opsinya akan ikut terhapus.')) {
      onDeleteGroup(groupId);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Grup Varian</h2>
        {/* Sambungkan tombol 'onClick' */}
        <button 
          onClick={onAddGroup}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>
      <ul>
        {groups.map(group => (
          <li
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer group transition-colors ${
              selectedGroupId === group.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-semibold">{group.name}</span>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm px-2 py-0.5 rounded-full ${
                  selectedGroupId === group.id
                    ? 'bg-blue-500'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {group.options.length} opsi
              </span>
              {/* Tombol Hapus Grup */}
              <button 
                onClick={(e) => handleDelete(e, group.id)}
                className={`p-1 rounded-md text-red-500 opacity-0 group-hover:opacity-100 ${
                  selectedGroupId === group.id ? 'hover:bg-blue-500' : 'hover:bg-red-100'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariantGroupList;