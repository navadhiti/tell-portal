import axios from 'axios';

export const headerWithToken = axios.create({
    baseURL: 'https://devapi.tell.navadhiti.com',
    // baseURL: 'https://e07d-2402-3a80-30-33d2-37f-284f-6387-43b8.ngrok-free.app',
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
