// src/context/AuthContext.jsx (Portal Tenant)
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
      // 1. Tangkap Token dari URL (biasanya saat redirect dari portal utama)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      if (tokenFromUrl) {
        localStorage.setItem('tenant_token', tokenFromUrl); // MENGGUNAKAN tenant_token
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Cek Validitas menggunakan key spesifik
      const token = localStorage.getItem('tenant_token');
      if (!token) {
        window.location.href = getLoginUrl();
        return;
      }

      try {
        const response = await checkAuth(); 
        setUser(response.data.user); 
      } catch (error) {
        console.error("Auth Failed:", error);
        localStorage.removeItem('tenant_token'); // HAPUS tenant_token
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
      localStorage.removeItem('tenant_token'); // HAPUS tenant_token
      setUser(null);
      window.location.href = getLoginUrl();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            Memuat Sistem Tenant...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
