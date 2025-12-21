import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil token awal dengan aman (cegah error parsing)
  const initialToken = localStorage.getItem('token');
  const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  // GUNAKAN useCallback DI SINI
  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []); // Dependency array kosong = fungsi stabil

  // GUNAKAN useCallback JUGA DI SINI
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = 'http://localhost:5173/login'; // Redirect ke portal User
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);