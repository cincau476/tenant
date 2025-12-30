import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil token awal dengan aman
  const initialToken = localStorage.getItem('token');
  const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  // LOGIN: Simpan data ke state dan localStorage
  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []); 

  // LOGOUT: Hapus data dan arahkan langsung ke domain produksi
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    // Langsung arahkan ke domain utama tanpa cek localhost
    window.location.href = 'https://www.kantinku.com/login'; 
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
