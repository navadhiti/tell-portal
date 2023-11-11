import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { RouterProvider } from 'react-router-dom';
import { routes } from './route';
import { Suspense, useState } from 'react';
import Loader from './components/loader';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import { Context } from './context';

const App = () => {
    const queryClient = new QueryClient();
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    return (
        <Suspense fallback={<Loader circle={true} />}>
            <Context.Provider value={{ alert, setAlert }}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <RouterProvider router={routes} />
                    </ThemeProvider>
                </QueryClientProvider>
            </Context.Provider>
        </Suspense>
    );
};
export default App;
