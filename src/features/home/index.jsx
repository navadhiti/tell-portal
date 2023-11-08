import {
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Stack,
} from '@mui/material';
import { PrimaryButton } from '../../elements/buttonStyles';
import { SubHeader } from '../../elements/textStyles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const HomeScreen = () => {
    return (
        <Container>
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                height={'85vh'}
            >
                <Card
                    sx={{
                        width: '80%',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    elevation={6}
                >
                    <CardContent
                        sx={{ width: '95%', backgroundColor: 'whitesmoke' }}
                    >
                        <SubHeader>Question :</SubHeader>
                        Nodejs is one of the most popularly used web development
                        runtime environments, it is the backbone of all
                        javascript frameworks including popular ones like,
                        react, angular, express, and so on. Nodejs can be used
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                            width={'100%'}
                        >
                            <IconButton>
                                <VolumeUpIcon />
                            </IconButton>
                        </Stack>
                    </CardContent>

                    <CardContent sx={{ width: '95%' }}>
                        <SubHeader>Answer :</SubHeader>
                        department (ED) and the types of cases it handles?
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                            width={'100%'}
                        >
                            <IconButton>
                                <VolumeUpIcon />
                            </IconButton>
                        </Stack>
                    </CardContent>

                    <Stack
                        direction={'row'}
                        width={'80%'}
                        justifyContent={'flex-end'}
                    >
                        <PrimaryButton>Next</PrimaryButton>
                    </Stack>
                </Card>
            </Grid>
        </Container>
    );
};

export default HomeScreen;
