import { Typography } from '@mui/material';
import styled from 'styled-components';

export const ModelHeader = styled(Typography)({
    '&&&': {
        color: 'grey',
        fontSize: '34px',
        fontWeight: 'bold',
    },
});

export const ParagraphBold = styled(Typography)({
    '&&&': {
        color: 'grey',
        fontSize: '22px',
        fontWeight: '400',
    },
});

export const SubHeader = styled(Typography)({
    '&&&': {
        color: '#4C4B4D',
        fontSize: '19px',
        fontWeight: '600',
        lineHeight: '50px',
    },
});

export const Content = styled(Typography)({
    '&&&': {
        fontSize: '19px',
        fontWeight: '600',
        lineHeight: '30px',
        textAlign: 'start',
        textTransform: 'capitalize',
    },
});
