import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dealership_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dealership_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('dealership_user');
        localStorage.removeItem('dealership_token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('dealership_token', data.token);
    localStorage.setItem('dealership_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('dealership_token', data.token);
    localStorage.setItem('dealership_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('dealership_token');
    localStorage.removeItem('dealership_user');
  };

  const demoLoginAdmin = async () => {
    return login('admin@dealership.com', 'admin123');
  };

  const demoLoginUser = async () => {
    return login('user@dealership.com', 'user123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLoginAdmin,
        demoLoginUser,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
