import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('miniblog_token');
    const savedUser = localStorage.getItem('miniblog_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Optionally re-verify token with backend
        api.getMe()
          .then((res) => {
            if (res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem('miniblog_user', JSON.stringify(res.data.user));
            }
          })
          .catch(() => {
            // Token was expired or invalid
            logout();
          })
          .finally(() => setLoading(false));
        return;
      } catch {
        logout();
      }
    }
    setLoading(false);

    // Listen for custom logout events from interceptor
    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('miniblog_token', receivedToken);
    localStorage.setItem('miniblog_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (name, email, password, role = 'reader') => {
    const res = await api.register({ name, email, password, role });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('miniblog_token', receivedToken);
    localStorage.setItem('miniblog_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('miniblog_token');
    localStorage.removeItem('miniblog_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    isReader: user?.role === 'reader',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
