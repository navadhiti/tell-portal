import { Button } from '@mui/material';
import styled from 'styled-components';

export const PrimaryButton = styled(Button)({
    '&&&': {
        padding: '13px 30px',
        backgroundColor: '#BB86FC',
        borderRadius: '10px',
        fontFamily: 'Poppins',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
        color: '#ffffff',
        height: '40px',
        '&:hover': {
            backgroundColor: '#D5B7F9',
            color: '#ffffff',
        },
        textTransform: 'capitalize',
    },
});

export const SecondaryButton = styled(Button)({
    '&&&': {
        padding: '13px 30px',
        backgroundColor: '#E0DBE6',
        borderRadius: '10px',
        fontFamily: 'Poppins',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
        color: 'black',
        height: '40px',
        '&:hover': {
            backgroundColor: '#D5B7F9',
            color: '#ffffff',
        },
        textTransform: 'capitalize',
    },
});
