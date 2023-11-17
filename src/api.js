import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://devapi.tell.navadhiti.com',
    // baseURL: 'https://6aff-42-106-184-213.ngrok-free.app',
});

headerWithToken.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('token');
    config.headers['ngrok-skip-browser-warning'] = true;
    return config;
});

export const tokenExpires = async () => {
    try {
        const response = await headerWithToken.get(
            '/api/admin/getAllQA?index=1'
        );
        if (
            response?.data?.responseObj?.responseMessage?.message ===
            'invalid token'
        ) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        return response;
    } catch (error) {
        return error;
    }
};
