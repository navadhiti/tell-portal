import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://devapi.tell.navadhiti.com',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('token');
    config.headers['ngrok-skip-browser-warning'] = true; // Add the ngrok-skip-browser-warning header
    return config;
});
