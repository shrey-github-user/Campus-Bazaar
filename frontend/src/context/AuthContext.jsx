import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import getErrorMessage from '../utils/getErrorMessage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from backend if token is stored
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/api/user/me');
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();

    // Auto logout only on tab/browser close (not refresh)
    const handleLogoutOnClose = (e) => {
      // If the page is being closed (not reloaded)
      if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
        if (!navigator.sendBeacon) return; // fallback: do nothing if not supported
        // Try to detect close (not reload)
        if (performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
    };
    document.addEventListener('visibilitychange', handleLogoutOnClose);
    return () => {
      document.removeEventListener('visibilitychange', handleLogoutOnClose);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const signup = async (data) => {
    try {
      const res = await api.post('/api/auth/signup', data);
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
