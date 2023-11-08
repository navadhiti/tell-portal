import { useQuery } from 'react-query';
import { headerWithToken } from '../../api';

export const getQuestionAnswers = (quiznumber) => {
    return useQuery({
        queryKey: ['getQuestionAnswers', quiznumber],
        queryFn: () =>
            headerWithToken
                .get(`/api/admin/getAllQA?index=${quiznumber}`)
                .then((response) => {
                    return response.data;
                }),
        keepPreviousData: true,
    });
};
