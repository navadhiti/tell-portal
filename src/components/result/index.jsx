import { Button, Grid, IconButton, Rating, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import StarIcon from '@mui/icons-material/Star';

import DialogTitle from '@mui/material/DialogTitle';
import { Content } from '../../elements/textStyles';
import { PrimaryButton, SecondaryButton } from '../../elements/buttonStyles';
import Confetti from 'react-confetti';
import CloseIcon from '@mui/icons-material/Close';
// eslint-disable-next-line react/prop-types
const ResultDialog = ({ open, handleClose, children, percentage }) => {
    let message = '';
    let color = '';
    if (percentage < 50) {
        message = 'Oops... But you tried well...!';
        color = '#FA423B';
    } else if (percentage <= 60) {
        message = 'Oops... But you tried well...!';
        color = '#FB683A';
    } else if (percentage <= 70) {
        message = 'Oops... But you tried well...!';
        color = '#FB683A';
    } else if (percentage <= 80) {
        message = 'Oops... But you tried well...!';
        color = '#7C6B36';
    } else if (percentage <= 90) {
        message = 'Oops... But you tried well...!';
        color = '#99CC32';
    } else if (percentage == 100) {
        message = 'You got it right !';
        color = '#54CD37';
    }
    const starSize = 6;

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
        var rot = (Math.PI / 2) * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (var i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'xs'}
        >
            <Stack
                justifyContent={'flex-end'}
                alignItems={'flex-end'}
                display={'flex'}
                width={'100%'}
            >
                {percentage === 100 && (
                    <Confetti
                        wind={0}
                        gravity={0.05}
                        opacity={1}
                        recycle={true}
                        numberOfPieces={50}
                        width={390}
                        height={150}
                        colors={['blue', 'red']}
                        drawShape={(ctx) => {
                            drawStar(ctx, 2, 2, 5, starSize, starSize / 3);
                        }}
                    />
                )}
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <DialogTitle maxHeight={'50px'} sx={{ textAlign: 'center' }}>
                <Stack
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={'flex'}
                    width={'100%'}
                >
                    <Rating
                        size="large"
                        name="text-feedback"
                        value={(percentage / 100) * 5}
                        readOnly
                        precision={0.5}
                        emptyIcon={
                            <StarIcon
                                style={{ opacity: 0.55 }}
                                fontSize="inherit"
                            />
                        }
                    />
                    <Button
                        size="large"
                        sx={{ fontWeight: 'bold', fontSize: '27px' }}
                    >
                        {percentage}/100
                    </Button>
                </Stack>
            </DialogTitle>

            <Grid
                container
                justifyContent={'center'}
                py={2}
                textTransform={'capitalize'}
            >
                {children}
            </Grid>

            <Grid container py={2} justifyContent={'center'}>
                <Content color={color}>{message}</Content>
            </Grid>

            {/* <DialogActions
                    sx={{
                        justifyContent: 'space-around',
                        maxHeight: '30px',
                        paddingBottom: 3,
                    }}
                >
                    <SecondaryButton size="small" onClick={handleClose}>
                        Retry
                    </SecondaryButton>
                    {percentage === 100 && (
                        <PrimaryButton onClick={handleClose}>Next</PrimaryButton>
                    )}
                </DialogActions> */}
        </Dialog>
    );
};

export default ResultDialog;
