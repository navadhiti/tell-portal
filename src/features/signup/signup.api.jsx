import { headerWithToken } from '../../api';

export const signup = async (data) => {

    const response = await headerWithToken.post('/api/user/register', data);
    return response;

};
