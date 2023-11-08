import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://024a-103-156-100-11.ngrok-free.app',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('token');
    return config;
});
