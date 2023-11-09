import { CircularProgress, LinearProgress } from '@mui/material';

// eslint-disable-next-line react/prop-types
const Loader = ({ circle, load }) => {
    return (
        load === true && (
            <>
                {circle === true ? (
                    <CircularProgress />
                ) : (
                    <LinearProgress color="secondary" />
                )}
            </>
        )
    );
};
export default Loader;
