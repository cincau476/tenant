import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil token awal dengan aman (cegah error parsing)
  const initialToken = localStorage.getItem('token');
  const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  // Fungsi helper untuk menentukan URL Login secara dinamis
  const getLoginUrl = () => {
    // Jika sedang di lingkungan produksi (bukan localhost), arahkan ke domain utama
    if (window.location.hostname !== 'localhost') {
      return 'https://www.kantinku.com/login';
    }
    // Fallback untuk development
    return 'http://localhost:5173/login';
};

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []); 

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    // REDIRECT DINAMIS: Mengganti http://localhost:5173/login yang lama
    window.location.href = getLoginUrl(); 
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
