import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { RouterProvider } from 'react-router-dom';
import { routes } from './route';
import { Suspense } from 'react';
import Loader from './components/loader';

const App = () => {
    return (
        <Suspense fallback={<Loader circle={true} />}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={routes} />
            </ThemeProvider>
        </Suspense>
    );
};
export default App;
