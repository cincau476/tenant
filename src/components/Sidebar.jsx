// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiBox, 
  FiLayers, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden lg:flex flex-col bg-white h-screen fixed left-0 top-0 border-r border-gray-200 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-orange-600 tracking-tight">Kantinku</h2>
              <p className="text-[10px] text-gray-400 uppercase">Tenant Panel</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className={`flex items-center gap-3 py-3 w-full text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <FiLogOut className="text-xl" />
            {!isCollapsed && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-[100] flex justify-around items-center shadow-lg pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 px-1 min-w-[64px] ${
              isActive(item.path) ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
