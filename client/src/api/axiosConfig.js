import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid session -> clear it and let the app send the user to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.startsWith('/auth/login') || err.config?.url?.startsWith('/auth/signup');
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err);
  }
);

export default api;
