import { useMutation } from 'react-query';
import { headerWithToken } from '../../api';

export const login = () => {
    return useMutation(async (data) => {
        const response = await headerWithToken.post('/api/user/login', data);
        return response;
    });
};
