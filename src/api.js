import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://40f7-103-156-100-11.ngrok-free.app',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('token');
    config.headers['ngrok-skip-browser-warning'] = true; // Add the ngrok-skip-browser-warning header
    return config;
});
