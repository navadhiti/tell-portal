import { Button } from '@mui/material';
import styled from 'styled-components';

export const PrimaryButton = styled(Button)({
    '&&&': {
        padding: '13px 30px',
        backgroundColor: '#53C6D9',
        borderRadius: '10px',
        fontFamily: 'Poppins',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
        color: '#ffffff',
        height: '40px',
        '&:hover': {
            backgroundColor: '#9ACFD8',
            color: '#ffffff',
        },
        textTransform: 'capitalize',
        letterSpacing: '2px',
    },
});

export const SecondaryButton = styled(Button)({
    '&&&': {
        padding: '13px 30px',
        // backgroundColor: '#E0DBE6',
        border: '1px solid #9ACFD8 ',
        borderRadius: '10px',
        fontFamily: 'Poppins',
        fontSize: '15px',
        fontWeight: '700',
        textAlign: 'center',
        color: '#5C6E7B',
        height: '40px',
        '&:hover': {
            backgroundColor: 'grey',
            color: '#ffffff',
        },
        textTransform: 'capitalize',
    },
});
