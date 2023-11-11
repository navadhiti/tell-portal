import {
    Navigate,
    Outlet,
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { lazy } from 'react';
import { Grid } from '@mui/material';
import Header from './layout/header';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;

    return (
        <>
            {isAuthenticated === true ? (
                <Grid
                    container
                    direction="column"
                    width="100%"
                    flexWrap="nowrap"
                >
                    <Header />
                    <Outlet />
                </Grid>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/signup'));
const Home = lazy(() => import('./pages/home'));
const Error = lazy(() => import('./components/error'));

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route>
                <Route path="/" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={<Home />}
                        errorElement={<Error />}
                    />
                </Route>
            </Route>
        </>
    )
);
