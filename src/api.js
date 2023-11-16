import axios from 'axios';

export const headerWithToken = axios.create({
    // baseURL: 'https://devapi.tell.navadhiti.com',
    baseURL: 'https://b0d1-2402-3a80-4a-3ed2-964c-dc8b-be46-ea7.ngrok-free.app',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('token');
    config.headers['ngrok-skip-browser-warning'] = true;
    return config;
});
