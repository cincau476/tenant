import React, { useState, createContext, useContext } from "react";
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  Layers, 
  Settings, 
  ChevronFirst, 
  ChevronLast, 
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SidebarContext = createContext();

export default function Sidebar() {
  // State untuk kontrol buka/tutup sidebar
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", link: "/" },
    { icon: <Utensils size={20} />, text: "Menu", link: "/menu" },
    { icon: <ClipboardList size={20} />, text: "Pesanan", link: "/orders" },
    { icon: <Layers size={20} />, text: "Varian", link: "/variants" },
    { icon: <Settings size={20} />, text: "Pengaturan", link: "/settings" },
  ];

  return (
    <aside className={`h-screen sticky top-0 transition-all ${expanded ? "w-64" : "w-20"}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        
        {/* Header: Logo & Toggle Button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>
            <span className="text-xl font-bold text-orange-600 tracking-tighter">KANTINKU</span>
          </div>
          <button 
            onClick={() => setExpanded((curr) => !curr)} 
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mt-4">
            {menuItems.map((item) => (
              <Link key={item.text} to={item.link}>
                <SidebarItem 
                  icon={item.icon} 
                  text={item.text} 
                  active={location.pathname === item.link} 
                />
              </Link>
            ))}
          </ul>
        </SidebarContext.Provider>

        {/* Footer: User & Logout */}
        <div className="border-t flex p-3">
          <button 
            onClick={logout} 
            className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut size={20} />
            <span className={`overflow-hidden transition-all whitespace-nowrap ${expanded ? "w-52 ml-3" : "w-0"}`}>
              Keluar Akun
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

// Sub-komponen untuk Item Navigasi
function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  
  return (
    <li className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${active 
        ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-800" 
        : "hover:bg-orange-50 text-gray-600"
      }
    `}>
      {icon}
      <span className={`overflow-hidden transition-all whitespace-nowrap ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${expanded ? "" : "top-2"}`} />
      )}

      {/* Tooltip saat sidebar mengecil */}
      {!expanded && (
        <div className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-orange-100 text-orange-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          z-50 whitespace-nowrap
        `}>
          {text}
        </div>
      )}
    </li>
  );
}