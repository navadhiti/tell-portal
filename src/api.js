import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://dev.api.atomzpower.com/api/v1',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['Token'] = localStorage.getItem('token');
    return config;
});
