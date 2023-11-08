import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { RouterProvider } from 'react-router-dom';
import { routes } from './route';
import { Suspense } from 'react';
import Loader from './components/loader';
import { QueryClient, QueryClientProvider } from 'react-query';

const App = () => {
    const queryClient = new QueryClient();

    return (
        <Suspense fallback={<Loader circle={true} />}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={routes} />
                </ThemeProvider>
            </QueryClientProvider>
        </Suspense>
    );
};
export default App;
