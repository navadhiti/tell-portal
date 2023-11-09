import { useMutation } from 'react-query';
import { headerWithToken } from '../../api';

export const signup = () => {
    return useMutation(async (data) => {
        const response = await headerWithToken.post('/api/user/register', data);
        return response;
    });
};
