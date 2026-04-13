import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dairyUser') || 'null'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      localStorage.setItem('dairyUser', JSON.stringify(data));
      setUser(data);
      return data;
    } finally { setLoading(false); }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await apiRegister(formData);
      localStorage.setItem('dairyUser', JSON.stringify(data));
      setUser(data);
      return data;
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('dairyUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
