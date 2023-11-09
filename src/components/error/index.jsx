import { Container, Grid } from '@mui/material';
import React from 'react';

const Error = () => {
    return (
        <Container>
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                height={'83vh'}
            >
                <img
                    style={{ height: '60vh', width: '80%' }}
                    src="https://assets.materialup.com/uploads/cc45c564-69ae-43cc-803f-7a189a6bbba6/preview.jpg"
                    alt="error"
                />
            </Grid>
        </Container>
    );
};

export default Error;
