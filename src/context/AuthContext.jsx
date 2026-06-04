import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // PERBAIKAN: Gunakan window.location.origin agar dinamis mengikuti IP / Domain saat ini
  const getLoginUrl = () => {
    return `${window.location.origin}/login`;
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Tangkap Token dari URL (saat redirect dari portal utama)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      if (tokenFromUrl) {
        // Pindah ke sessionStorage agar token hilang saat browser ditutup
        sessionStorage.setItem('tenant_token', tokenFromUrl); 
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Ambil token dari sessionStorage
      const token = sessionStorage.getItem('tenant_token');
      if (!token) {
        window.location.href = getLoginUrl();
        return;
      }

      try {
        // Verifikasi token ke backend
        const response = await checkAuth(); 
        
        // Pengecekan aman untuk response data
        if (response.data && response.data.user) {
          setUser(response.data.user); 
        } else if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Auth Failed:", error);
        // Hapus token jika tidak valid
        sessionStorage.removeItem('tenant_token'); 
        localStorage.removeItem('tenant_token'); // Fallback pembersihan
        window.location.href = getLoginUrl();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutApi(); 
    } catch (err) {
      console.warn("Logout server fail", err);
    } finally {
      // Bersihkan sesi secara total agar tidak ada token tersisa
      sessionStorage.removeItem('tenant_token');
      sessionStorage.removeItem('tenant_user');
      localStorage.removeItem('tenant_token');
      localStorage.removeItem('tenant_user');
      
      setUser(null);
      window.location.href = getLoginUrl();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-orange-600 font-medium">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Memuat Sistem Tenant...</p>
            </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
