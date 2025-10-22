import React from 'react';
import { Plus } from 'lucide-react';

const VariantGroupList = ({ groups, selectedGroupId, onSelectGroup }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Grup Varian</h2>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>
      <ul>
        {groups.map(group => (
          <li
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedGroupId === group.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-semibold">{group.name}</span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full ${
                selectedGroupId === group.id
                  ? 'bg-blue-500'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {group.options.length} opsi
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariantGroupList;
