import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if token is valid on app load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.post('/api/auth/verify', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.valid) setIsAdmin(true);
        else localStorage.removeItem('admin_token');
      }).catch(() => {
        localStorage.removeItem('admin_token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (password) => {
    const res = await axios.post('/api/auth/login', { password });
    localStorage.setItem('admin_token', res.data.token);
    setIsAdmin(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  const getToken = () => localStorage.getItem('admin_token');

  const authAxios = axios.create();
  authAxios.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
