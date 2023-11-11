import {
    Backdrop,
    CircularProgress,
    Grow,
    LinearProgress
} from '@mui/material';

// eslint-disable-next-line react/prop-types
const Loader = ({ circle, load }) => {
    return (
        load === true && (
            <>
                {circle === true ? (
                    <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <Grow
                            in={true}
                            exit={true}
                            style={{ transformOrigin: '20 10 10' }}
                            {...(load ? { timeout: 1000 } : {})}
                        >
                            <CircularProgress color="primary" />
                        </Grow>
                    </Backdrop>
                ) : (
                    <LinearProgress color="secondary" />
                )}
            </>
        )
    );
};
export default Loader;
