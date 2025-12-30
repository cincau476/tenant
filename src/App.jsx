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

onst ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Arahkan ke domain produksi
    window.location.href = 'https://www.kantinku.com/login';
    return null;
  }
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
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
