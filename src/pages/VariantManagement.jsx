import React, { useState } from 'react';
import VariantGroupList from '../components/VariantGroupList';
import VariantOptionList from '../components/VariantOptionList';

// Data sementara untuk simulasi
const initialVariantData = [
  {
    id: 'group-1',
    name: 'Level Pedas',
    options: [
      { id: 'opt-1-1', name: 'Level 1 (Tidak Pedas)', price: 0 },
      { id: 'opt-1-2', name: 'Level 2 (Pedas Sedang)', price: 0 },
      { id: 'opt-1-3', name: 'Level 3 (Pedas Banget)', price: 1000 },
    ]
  },
  {
    id: 'group-2',
    name: 'Ukuran',
    options: [
        { id: 'opt-2-1', name: 'Kecil', price: -2000 },
        { id: 'opt-2-2', name: 'Sedang', price: 0 },
        { id: 'opt-2-3', name: 'Besar', price: 3000 },
    ]
  },
  {
    id: 'group-3',
    name: 'Topping Tambahan',
    options: [
        { id: 'opt-3-1', name: 'Keju Mozzarella', price: 4000 },
        { id: 'opt-3-2', name: 'Telur Mata Sapi', price: 3000 },
    ]
  }
];

const VariantManagement = () => {
  const [variantGroups, setVariantGroups] = useState(initialVariantData);
  const [selectedGroupId, setSelectedGroupId] = useState(initialVariantData[0]?.id || null);

  const selectedGroup = variantGroups.find(group => group.id === selectedGroupId);

  // TODO: Tambahkan fungsi untuk handle CUD (Create, Update, Delete)
  // yang akan memanggil API dan memperbarui state 'variantGroups'.

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Varian</h1>
        <p className="text-gray-500 mt-1">Kelola grup varian dan opsi untuk menu Anda</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <VariantGroupList 
                groups={variantGroups}
                selectedGroupId={selectedGroupId}
                onSelectGroup={setSelectedGroupId}
            />
        </div>
        <div className="lg:col-span-2">
            {selectedGroup ? (
                <VariantOptionList 
                    key={selectedGroup.id} // <-- Key penting agar komponen re-render saat grup berubah
                    group={selectedGroup}
                />
            ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">Pilih grup untuk melihat opsinya.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VariantManagement;
