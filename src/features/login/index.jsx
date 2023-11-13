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
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { login } from './login.api';
import Loader from '../../components/loader';
import { useMutation } from 'react-query';
import { CustomAlert } from '../../components/alert/index.jsx';
import { Context } from '../../context';
const LoginScreen = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { alert, setAlert } = useContext(Context);

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
        password: yup.string().required('Password is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { mutate: loginMutate, isLoading: loginLoading } = useMutation(
        login,
        {
            onSuccess: (response) => {
                if (response) {
                    localStorage.setItem('token', response?.data?.data?.token);
                    const storedToken = localStorage.getItem('token');
                    if (storedToken) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: 'Login successfull',
                        });
                        navigate('/dashboard');
                    }
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
        loginMutate(data);
    };

    useEffect(() => {
        setAlert({ ...alert, open: false });

        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, []);

    return (
        <Container>
            <Loader load={loginLoading} />

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
                            <ModelHeader>LOGIN</ModelHeader>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: '30px',
                                }}
                            >
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
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Log In
                                </PrimaryButton>
                            </form>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-around'}
                            >
                                <p>Dont have an account</p>
                                <Link to={'sign-up'}>Sign up</Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LoginScreen;

// eslint-disable-next-line react/prop-types
const ErrorToast = ({ error }) => {
    return error ? (
        // eslint-disable-next-line react/prop-types
        <span style={{ color: 'red', fontSize: 'small', paddingLeft: '10px' }}>
            <b> * </b> {error}
        </span>
    ) : null;
};
