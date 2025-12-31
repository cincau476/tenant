import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import VariantManagement from './pages/VariantManagement';
import StandSettings from './pages/StandSettings';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const getPageTitle = (path) => {
    switch(path) {
      case '/': return 'Dashboard';
      case '/menu': return 'Manajemen Menu';
      case '/orders': return 'Daftar Pesanan';
      case '/variants': return 'Manajemen Varian';
      case '/settings': return 'Pengaturan Kantin';
      default: return 'Kantinku';
    }
  };

  // Jika masih verifikasi, AuthProvider sudah menampilkan layar loading, 
  // tapi kita tambahkan pengaman di sini agar tidak terjadi redirect dini.
  if (isLoading) return null;

  // Jika tidak ada user setelah loading selesai, arahkan ke login utama
  if (!user) {
    window.location.href = 'https://www.kantinku.com/login';
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      
      <main className={`flex-1 transition-all duration-300 min-h-screen ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-orange-600 uppercase tracking-widest hidden sm:inline">Online</span>
             <button onClick={logout} className="text-xs text-red-600 font-bold ml-4">LOGOUT</button>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 text-gray-900">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rute "/" otomatis menangani token dari URL berkat logic di AuthProvider */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
        <Route path="/variants" element={<ProtectedRoute><VariantManagement /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><StandSettings /></ProtectedRoute>} />
        
        {/* Redirect /external-login ke / agar diproses oleh ProtectedRoute & AuthProvider */}
        <Route path="/external-login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
