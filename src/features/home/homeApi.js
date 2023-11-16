import { useQuery } from 'react-query';
import { headerWithToken } from '../../api';
import { compareArrays, replaceAll } from '../../components/helper';

export const getQuestionAnswers = (quiznumber) => {
    return useQuery({
        queryKey: ['getQuestionAnswers', quiznumber],
        queryFn: () =>
            headerWithToken
                .get(`/api/admin/getAllQA?index=${quiznumber}`)
                .then((response) => {
                    return response.data;
                })
                .catch((response) => {
                    return response?.response?.data;
                }),
        keepPreviousData: true,
    });
};

export const valueCalcuate = (text, speechText) => {
    try {
        let texttemp = speechText.toLowerCase();

        texttemp = replaceAll(texttemp, '.', ' ');
        texttemp = replaceAll(texttemp, "'", ' ');
        texttemp = replaceAll(texttemp, ',', ' ');
        texttemp = replaceAll(texttemp, '!', ' ');
        texttemp = replaceAll(texttemp, '|', ' ');
        texttemp = replaceAll(texttemp, '?', '');

        const studentTextArray = texttemp
            .split(' ')
            .filter((word) => word !== '');

        let tempteacherText = text.toLowerCase();

        tempteacherText = replaceAll(tempteacherText, '.', ' ');
        tempteacherText = replaceAll(tempteacherText, "'", ' ');
        tempteacherText = replaceAll(tempteacherText, ',', ' ');
        tempteacherText = replaceAll(tempteacherText, '!', ' ');
        tempteacherText = replaceAll(tempteacherText, '|', ' ');
        tempteacherText = replaceAll(tempteacherText, '?', ' ');
        const teacherTextArray = tempteacherText.split(' ');

        let student_correct_words_result = [];
        let student_incorrect_words_result = [];
        let originalwords = teacherTextArray.length;
        let studentswords = studentTextArray.length;
        // let wrong_words = 0;
        let correct_words = 0;
        let result_per_words = 0;
        // let result_per_words1 = 0;
        // let occuracy_percentage = 0;

        let word_result_array = compareArrays(
            teacherTextArray,
            studentTextArray
        );

        for (let i = 0; i < studentTextArray.length; i++) {
            if (teacherTextArray.includes(studentTextArray[i])) {
                correct_words++;
                student_correct_words_result.push(studentTextArray[i]);
            } else {
                // wrong_words++;
                student_incorrect_words_result.push(studentTextArray[i]);
            }
        }
        //calculation method
        if (originalwords >= studentswords) {
            result_per_words = Math.round(
                Number((correct_words / originalwords) * 100)
            );
        } else {
            result_per_words = Math.round(
                Number((correct_words / studentswords) * 100)
            );
        }

        let word_result = result_per_words === 100 ? 'correct' : 'incorrect';

        const response = {
            student_correct_words_result: student_correct_words_result,
            student_incorrect_words_result: student_incorrect_words_result,
            word_result: word_result,
            word_result_array: word_result_array,
            result_in_percentage: result_per_words,
        };
        return response;
    } catch (error) {
        return error;
    }
};
