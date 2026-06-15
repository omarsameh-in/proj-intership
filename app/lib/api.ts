import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Tunnel-Skip-AntiSpam-Page': 'true',
    },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
    (config) => {
        // Prevent duplicate /api in the final request URL
        if (config.url && config.url.startsWith('/api/')) {
            config.url = config.url.substring(4);
        } else if (config.url && config.url.startsWith('api/')) {
            config.url = config.url.substring(3);
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
