import { Alert, Snackbar } from '@mui/material';
import { useContext } from 'react';
import { Context } from '../../context';

// eslint-disable-next-line react/prop-types
export const CustomAlert = ({ onclose }) => {
    const { alert, setAlert } = useContext(Context);

    const handleAlertClose = (event, reason) => {
        if (onclose) {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({ ...alert, open: false });
        }
    };
    return (
        <Snackbar
            sx={{ borderRadius: '10px' }}
            open={alert?.open}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleAlertClose}
        >
            <Alert
                elevation={4}
                sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                }}
                onClose={handleAlertClose}
                severity={alert?.severity}
            >
                {alert?.message}
            </Alert>
        </Snackbar>
    );
};
