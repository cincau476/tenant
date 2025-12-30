// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiBox, 
  FiLayers, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'Pesanan', path: '/orders', icon: <FiShoppingBag /> },
    { name: 'Menu', path: '/menu', icon: <FiBox /> },
    { name: 'Varian', path: '/variants', icon: <FiLayers /> },
    { name: 'Pengaturan', path: '/settings', icon: <FiSettings /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Tampil di layar > 1024px) --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-700 z-40">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-500 tracking-tight">Kantinku</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Tenant Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
            <FiLogOut className="text-xl" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE & IPAD BOTTOM NAV (Tampil di layar < 1024px) --- */}
      {/* env(safe-area-inset-bottom) digunakan untuk menangani "Home Indicator" pada iPhone 14/15 Pro */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 px-2 py-1 z-[100] flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 px-1 min-w-[64px] transition-all ${
              isActive(item.path) ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-[10px] font-medium tracking-tight truncate w-full text-center">
              {item.name}
            </span>
            {/* Indikator Aktif Dot */}
            {isActive(item.path) && (
              <div className="w-1 h-1 bg-orange-500 rounded-full mt-1"></div>
            )}
          </Link>
        ))}
        
        {/* Tombol Logout Ringkas untuk Mobile */}
        <button className="flex flex-col items-center justify-center py-2 px-1 min-w-[64px] text-gray-500">
          <FiLogOut className="text-2xl mb-1" />
          <span className="text-[10px] font-medium">Out</span>
        </button>
      </nav>
    </>
  );
}