import { Container, Grid, Stack, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModelHeader } from '../../elements/textStyles';
import { PrimaryButton } from '../../elements/buttonStyles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const SignUpScreen = () => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    const navigate = useNavigate();
    const validationSchema = yup.object().shape({
        fullName: yup.string().required('Full name is required'),
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
        phoneNumber: yup
            .string()
            .required('Phone Number is required')
            .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
        password: yup
            .string()
            .required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must be strong: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
        },
    });

    const onSubmit = (data) => {
        return data;
    };

    useEffect(() => {
        if (isAuthenticated == true) {
            navigate('/dashboard');
        }
    }, []);
    return (
        <Container>
            <Grid
                container
                height={'97vh'}
                alignItems={'center'}
                justifyContent={'center'}
                flexWrap={'wrap'}
            >
                <Grid item md={6} lg={6} sm={12} xs={12}>
                    <img
                        style={{ width: '100%' }}
                        src="https://preview.colorlib.com/theme/bootstrap/login-form-07/images/undraw_remotely_2j6y.svg"
                        alt="Image"
                    />
                </Grid>

                <Grid item md={6} sm={12} lg={6} xs={12}>
                    <Grid container xs={12} justifyContent="center">
                        <Grid
                            item
                            md={8}
                            xs={12}
                            direction="column"
                            rowGap={'20px'}
                        >
                            <ModelHeader>SIGN UP</ModelHeader>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: '20px',
                                }}
                            >
                                <Stack>
                                    <TextField
                                        label="Full name"
                                        {...register('fullName', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <ErrorToast
                                        error={errors.fullName?.message}
                                    />
                                </Stack>
                                <Stack>
                                    <TextField
                                        label="Email"
                                        {...register('email', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <ErrorToast
                                        error={errors?.email?.message}
                                    />
                                </Stack>

                                <Stack>
                                    <TextField
                                        type="Number"
                                        label="Phone Number"
                                        {...register('phoneNumber', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <ErrorToast
                                        error={errors.phoneNumber?.message}
                                    />
                                </Stack>

                                <Stack>
                                    <TextField
                                        type="password"
                                        label="Password"
                                        {...register('password', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <ErrorToast
                                        error={errors.password?.message}
                                    />
                                </Stack>

                                <PrimaryButton
                                    sx={{ mt: 1 }}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Sign In
                                </PrimaryButton>
                            </form>
                            <Stack
                                py={3}
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-around'}
                            >
                                <Link to={'/'} style={{ fontWeight: 'bold' }}>
                                    Back to login
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SignUpScreen;

// eslint-disable-next-line react/prop-types
const ErrorToast = ({ error }) => {
    return error ? (
        <span style={{ color: 'red', fontSize: 'small', paddingLeft: '10px' }}>
            <b> * </b> {error}
        </span>
    ) : null;
};
