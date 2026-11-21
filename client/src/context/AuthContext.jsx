import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // Restore session on page load
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const authenticate = async (mode, payload) => {
    const { data } = await api.post(`/auth/${mode}`, payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: (p) => authenticate('login', p), signup: (p) => authenticate('signup', p), logout }}>
      {children}
    </AuthContext.Provider>
  );
}
