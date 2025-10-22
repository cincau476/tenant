import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MenuCard from '../components/MenuCard';

// Data sementara untuk simulasi
const initialMenuItems = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    price: 25000,
    stock: 50,
    available: true,
    imageUrl: 'https://placehold.co/600x400/f8b4b4/333?text=Nasi+Goreng',
  },
  {
    id: 2,
    name: 'Mie Ayam Bakso',
    price: 18000,
    stock: 35,
    available: true,
    imageUrl: 'https://placehold.co/600x400/b4f8c8/333?text=Mie+Ayam',
  },
  {
    id: 3,
    name: 'Ayam Geprek + Nasi',
    price: 22000,
    stock: 0,
    available: false,
    imageUrl: 'https://placehold.co/600x400/f8d4b4/333?text=Ayam+Geprek',
  },
  {
    id: 4,
    name: 'Soto Ayam',
    price: 20000,
    stock: 25,
    available: true,
    imageUrl: 'https://placehold.co/600x400/b4c8f8/333?text=Soto+Ayam',
  },
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const handleAvailabilityChange = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
    // TODO: Tambahkan API call untuk update status 'available' ke backend
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Menu</h1>
          <p className="text-gray-500 mt-1">Kelola item menu Anda dengan mudah</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Tambah Menu Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map(item => (
          <MenuCard 
            key={item.id}
            item={item}
            onAvailabilityChange={() => handleAvailabilityChange(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
