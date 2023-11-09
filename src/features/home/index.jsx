import {
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Stack,
} from '@mui/material';
import { PrimaryButton, SecondaryButton } from '../../elements/buttonStyles';
import { Content, SubHeader } from '../../elements/textStyles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Loader from '../../components/loader';
import { getQuestionAnswers } from './homeApi';
import Cookies from 'js-cookie';
const HomeScreen = () => {
    const quiznumber = Cookies.get('quiznumber')
        ? JSON.parse(Cookies.get('quiznumber'))
        : 1;
    const [quizNo, setQuizNo] = useState(quiznumber);
    const [isSpeaked, setIsSpeaked] = useState({
        question: false,
        answer: false,
    });
    const [texttospeechaudio, settexttospeechaudio] = useState('');
    const [playing, setPlaying] = useState(1);
    const [loading, setLoading] = useState(false);
    const {
        data: DataQuizAndAnswers,
        isLoading,
        refetch,
    } = getQuestionAnswers(quiznumber);

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

    useEffect(() => {
        refetch();
    }, [quizNo]);

    return (
        <Container>
            <Loader load={loading || isLoading} />
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                height={'82vh'}
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
                        sx={{
                            width: '95%',
                            backgroundColor: '#D9F0F4',
                            borderRadius: '5px',
                        }}
                    >
                        <SubHeader>Question :</SubHeader>
                        <Content
                            color={isSpeaked.question ? 'GrayText' : '#034EA1'}
                        >
                            {DataQuizAndAnswers?.data?.question}
                        </Content>
                        <Stack
                            direction={'row'}
                            justifyContent={
                                texttospeechaudio ? 'flex-end' : 'flex-end'
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
                                            DataQuizAndAnswers?.data?.question
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
                            color={isSpeaked.answer ? 'GrayText' : '#034EA1'}
                        >
                            {DataQuizAndAnswers?.data?.answer}
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
                                        convertai4bharat(
                                            DataQuizAndAnswers?.data?.answer
                                        );
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
                        alignItems={'center'}
                        justifyContent={
                            quizNo > 1 ? 'space-between' : 'flex-end'
                        }
                    >
                        {quizNo > 1 && (
                            <SecondaryButton
                                onClick={() => {
                                    if (!quizNo <= 0) {
                                        settexttospeechaudio('');
                                        Cookies.set(
                                            'quiznumber',
                                            quiznumber - 1
                                        );
                                        setQuizNo(quizNo - 1);
                                        setIsSpeaked({
                                            answer: false,
                                            question: false,
                                        });
                                    }
                                }}
                            >
                                Previous
                            </SecondaryButton>
                        )}

                        <PrimaryButton
                            disabled={
                                DataQuizAndAnswers?.data?.totalQuestions <=
                                quizNo
                            }
                            onClick={() => {
                                settexttospeechaudio('');
                                Cookies.set('quiznumber', quiznumber + 1);
                                setQuizNo(quizNo + 1);
                                setIsSpeaked({
                                    answer: false,
                                    question: false,
                                });
                            }}
                        >
                            {' '}
                            {DataQuizAndAnswers?.data?.totalQuestions === quizNo
                                ? 'Completed'
                                : 'Next'}
                        </PrimaryButton>
                    </Stack>
                </Card>
            </Grid>
        </Container>
    );
};

export default HomeScreen;
