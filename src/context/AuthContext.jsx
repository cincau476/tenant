import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLoginUrl = () => {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : 'https://www.kantinku.com/login';
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
        setUser(response.data.user); 
      } catch (error) {
        console.error("Auth Failed:", error);
        // Hapus token jika tidak valid
        sessionStorage.removeItem('tenant_token'); 
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
      // Bersihkan sesi secara total
      sessionStorage.clear();
      setUser(null);
      window.location.href = getLoginUrl();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white font-medium">
            Memuat Sistem Tenant...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
