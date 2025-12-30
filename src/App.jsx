import { Routes, Route, useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import VariantManagement from './pages/VariantManagement';
import StandSettings from './pages/StandSettings';

const ExternalLoginHandler = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token, { role: 'seller' });
      navigate('/');
    }
  }, [searchParams, login, navigate]);

  return <div className="h-screen flex items-center justify-center">Authenticating...</div>;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Mapping nama halaman untuk Header
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

  if (!isAuthenticated) {
    window.location.href = 'https://www.kantinku.com/login';
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      {/* Layout responsif terhadap sidebar desktop */}
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* KOTAK PUTIH PANJANG (HEADER) */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
              T
            </div>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">Tenant Panel</span>
          </div>
        </header>
        
        {/* Konten Halaman */}
        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
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
        <Route path="/external-login" element={<ExternalLoginHandler />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
        <Route path="/variants" element={<ProtectedRoute><VariantManagement /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><StandSettings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
