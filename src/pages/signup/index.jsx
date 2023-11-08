import React, { useEffect } from 'react';
import SignUpScreen from '../../features/signup';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated == true) {
            navigate('/dashboard');
        }
    }, []);

    return <SignUpScreen />;
};

export default SignUp;
