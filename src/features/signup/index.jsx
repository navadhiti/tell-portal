import {
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModelHeader } from '../../elements/textStyles';
import { PrimaryButton } from '../../elements/buttonStyles';
import { yupResolver } from '@hookform/resolvers/yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { signup } from './signup.api';
import { Context } from '../../context';
import { useMutation } from 'react-query';
import Loader from '../../components/loader';
import { CustomAlert } from '../../components/alert';

const SignUpScreen = () => {
    const navigate = useNavigate();
    const { alert, setAlert } = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        const newValue = e.target.value.slice(0, 10); // Take only the first 10 characters
        setInputValue(newValue);
    };

    const validationSchema = yup.object().shape({
        fullName: yup.string().required('Full name is required'),
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required')
            .matches(
                /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{3,4}$/,
                'Incorrect email'
            ),
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

    const { mutate: signUpMutate, isLoading: signUpLoading } = useMutation(
        signup,
        {
            onSuccess: (response) => {
                if (response?.data?.responseObj?.responseCode === 200) {
                    const token =
                        response?.data?.responseObj?.responseDataParams?.data
                            ?.token;
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: response?.data?.responseObj?.responseMessage,
                    });
                    localStorage.setItem('token', token);
                    navigate('/dashboard');
                } else {
                    setAlert({
                        open: true,
                        severity: 'warning',
                        message: response?.data?.responseObj?.responseMessage,
                    });
                }
            },

            onError: (error) => {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong...!',
                });
                return error;
            },
        }
    );

    const onSubmit = (data) => {
        signUpMutate(data);
    };
    useEffect(() => {
        setAlert({ ...alert, open: false });
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, []);
    return (
        <Container>
            <Loader load={signUpLoading} />
            <CustomAlert
                open={alert?.open}
                message={alert?.message}
                severity={alert?.severity}
                onclose={() => true}
            />

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
                                        label="Phone number"
                                        {...register('phoneNumber', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        onKeyDown={(e) =>
                                            (e.key === 'e' ||
                                                e.key === '.' ||
                                                e.key === '-' ||
                                                e.key === ',') &&
                                            e.preventDefault()
                                        }
                                    />
                                    <ErrorToast
                                        error={errors.phoneNumber?.message}
                                    />
                                </Stack>

                                <Stack>
                                    <TextField
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        label="Password"
                                        {...register('password', {
                                            required: true,
                                        })}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityIcon fontSize="small" />
                                                        ) : (
                                                            <VisibilityOffIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                    Sign Up
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
