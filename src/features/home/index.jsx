import {
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Stack,
} from '@mui/material';
import { PrimaryButton } from '../../elements/buttonStyles';
import { Content, SubHeader } from '../../elements/textStyles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Loader from '../../components/loader';
import { getQuestionAnswers } from './homeApi';
import Cookies from 'js-cookie';
const HomeScreen = () => {
    const quiznumber = Cookies.get('quiznumber')
        ? JSON.parse(Cookies.get('quiznumber'))
        : 1;
    const [isSpeaked, setIsSpeaked] = useState({
        question: false,
        answer: false,
    });
    const [texttospeechaudio, settexttospeechaudio] = useState('');
    const [playing, setPlaying] = useState(1);
    const [loading, setLoading] = useState(false);
    const { data: DataQuizAndAnswers, isLoading } =
        getQuestionAnswers(quiznumber);

    const convertai4bharat = (propText) => {
        setLoading(true);
        settexttospeechaudio('');
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        var payload = JSON.stringify({
            controlConfig: {
                dataTracking: true,
            },
            input: [
                {
                    source: propText,
                },
            ],
            config: {
                gender: 'female',
                language: {
                    sourceLanguage: 'en',
                },
            },
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: payload,
            redirect: 'follow',
        };
        const apiURL = 'https://demo-api.models.ai4bharat.org/inference/tts';
        fetch(apiURL, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                var apiResponse = JSON.parse(result);
                var audioContent = apiResponse['audio'][0]['audioContent'];
                var audio = 'data:audio/wav;base64,' + audioContent;
                setLoading(false);
                settexttospeechaudio(audio);
            });
    };

    return (
        <Container>
            <Loader load={loading || isLoading} />
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                height={'82vh'}
            >
                {DataQuizAndAnswers?.data.map((data, index) => {
                    return (
                        <Card
                            key={index}
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
                                sx={{
                                    width: '95%',
                                    backgroundColor: 'whitesmoke',
                                }}
                            >
                                <SubHeader>Question :</SubHeader>
                                <Content
                                    color={
                                        isSpeaked.question
                                            ? 'GrayText'
                                            : '#BB86FC'
                                    }
                                >
                                    {data?.question}
                                </Content>
                                <Stack
                                    direction={'row'}
                                    justifyContent={
                                        texttospeechaudio
                                            ? 'flex-end'
                                            : 'flex-end'
                                    }
                                    width={'100%'}
                                >
                                    {texttospeechaudio && playing === 1 ? (
                                        <ReactAudioPlayer
                                            src={texttospeechaudio}
                                            controls
                                            autoPlay
                                        />
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                setPlaying(1);
                                                setIsSpeaked({
                                                    ...isSpeaked,
                                                    question: true,
                                                });
                                                convertai4bharat(
                                                    data?.question
                                                );
                                            }}
                                        >
                                            <VolumeUpIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </CardContent>

                            <CardContent sx={{ width: '95%' }}>
                                <SubHeader>Answer :</SubHeader>
                                <Content
                                    color={
                                        isSpeaked.answer
                                            ? 'GrayText'
                                            : '#BB86FC'
                                    }
                                >
                                    {data?.answer}
                                </Content>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'flex-end'}
                                    width={'100%'}
                                >
                                    {' '}
                                    {texttospeechaudio && playing === 2 ? (
                                        <ReactAudioPlayer
                                            src={texttospeechaudio}
                                            controls
                                            autoPlay
                                        />
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                setPlaying(2);
                                                setIsSpeaked({
                                                    ...isSpeaked,
                                                    answer: true,
                                                });
                                                convertai4bharat(data?.answer);
                                            }}
                                        >
                                            <VolumeUpIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </CardContent>

                            <Stack
                                direction={'row'}
                                width={'80%'}
                                justifyContent={'flex-end'}
                            >
                                <PrimaryButton
                                    onClick={() => {
                                        Cookies.set(
                                            'quiznumber',
                                            quiznumber + 1
                                        );
                                    }}
                                >
                                    Next
                                </PrimaryButton>
                            </Stack>
                        </Card>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default HomeScreen;
