import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'abrigos_token';
const ADMIN_KEY = 'abrigos_admin';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState(() => {
    const a = localStorage.getItem(ADMIN_KEY);
    return a ? JSON.parse(a) : null;
  });

  const isAdmin = !!token && !!admin;

  // Injeta o token em todas as requisições axios quando logado
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const login = useCallback((novoToken, dadosAdmin) => {
    localStorage.setItem(TOKEN_KEY, novoToken);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(dadosAdmin));
    axios.defaults.headers.common['Authorization'] = `Bearer ${novoToken}`;
    setToken(novoToken);
    setAdmin(dadosAdmin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
