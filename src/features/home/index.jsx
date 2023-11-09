import {
    Card,
    CardContent,
    Chip,
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
import { getQuestionAnswers, valueCalcuate } from './homeApi';
import Cookies from 'js-cookie';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import AudioAnalyser from 'react-audio-analyser';

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-IN';

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

    const [listening, setListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [transformedWordResult, setTransformedWordResult] = useState(null);

    const [status, setStatus] = useState('');
    const [audioSrc, setAudioSrc] = useState('');
    const [audioType, setAudioType] = useState('audio/wav');

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

    const handleListen = () => {
        if (listening) {
            recognition.start();
            recognition.onend = () => {
                recognition.start();
            };
        } else {
            recognition.stop();
            recognition.onend = () => {
                console.log('Stopped listening per click');
            };
        }

        recognition.onstart = () => {
            console.log('Listening!');
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += transcript + ' ';
                else interim += transcript;
            }
            setInterimTranscript(interim);
            setFinalTranscript(final);

            const data = valueCalcuate(
                DataQuizAndAnswers?.data?.question,
                final
            );
            setTransformedWordResult(data);
        };

        recognition.onerror = (event) => {
            console.log('Error occurred in recognition: ' + event.error);
        };
    };

    useEffect(() => {
        handleListen();
    }, [listening]);

    useEffect(() => {
        refetch();
    }, [quizNo]);

    const SpeechedText = finalTranscript.split(' ');

    const toggleListen = () => {
        setFinalTranscript('');
        setPlaying(1);
        if (listening == true) {
            setListening((prevState) => !prevState);
            setListeningAnswer(false);
        } else {
            setListening((prevState) => !prevState);
            setListeningAnswer(false);
        }
    };

    const [listeningAnswer, setListeningAnswer] = useState(false);
    const [transformedAnswerResult, setTransformedAnswerResult] =
        useState(null);

    const handleAnswerListen = () => {
        const recognitionAnswer = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();

        recognitionAnswer.continuous = true;
        recognitionAnswer.interimResults = true;
        recognitionAnswer.lang = 'en-IN';

        recognitionAnswer.onstart = () => {
            console.log('Listening for answer!');
        };

        recognitionAnswer.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += transcript + ' ';
                else interim += transcript;
            }
            setInterimTranscript(interim);
            setFinalTranscript(final);
            // Use the valueCalcuate function or any logic to process the answer
            const data = valueCalcuate(DataQuizAndAnswers?.data?.answer, final);
            // Set the processed data to state
            setTransformedAnswerResult(data);
        };

        recognitionAnswer.onerror = (event) => {
            console.log(
                'Error occurred in recognition for answer: ' + event.error
            );
        };

        recognitionAnswer.start();
    };

    const toggleAnswerListen = () => {
        setListening(false);
        setPlaying(2);
        setFinalTranscript('');
        if (listeningAnswer === true) {
            setListeningAnswer((prevState) => !prevState);
        } else {
            setListeningAnswer(true);
            handleAnswerListen();
        }
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
                            backgroundColor: 'whitesmoke',
                        }}
                    >
                        <SubHeader>Question :</SubHeader>
                        <Content
                            color={isSpeaked.question ? 'GrayText' : '#BB86FC'}
                        >
                            {' '}
                            {texttospeechaudio && playing === 1 ? (
                                <>
                                    <ReactAudioPlayer
                                        src={texttospeechaudio}
                                        controls
                                        autoPlay
                                        style={{ display: 'none' }}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            setPlaying(1);
                                            setIsSpeaked({
                                                ...isSpeaked,
                                                question: true,
                                            });
                                            convertai4bharat(
                                                DataQuizAndAnswers?.data
                                                    ?.question
                                            );
                                        }}
                                    >
                                        <VolumeUpIcon color="primary" />
                                    </IconButton>
                                </>
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
                            {DataQuizAndAnswers?.data?.question} ?
                        </Content>
                        <Stack
                            mt={2}
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            width={'100%'}
                        >
                            <Grid
                                container
                                alignItems={'center'}
                                columnGap={1}
                                justifyContent={'flex-start'}
                            >
                                {!listening ? (
                                    <Chip
                                        id="startaudio"
                                        onClick={toggleListen}
                                        icon={<KeyboardVoiceIcon />}
                                        label="Try now"
                                    />
                                ) : (
                                    <Chip
                                        onClick={toggleListen}
                                        id="stopaudio"
                                        icon={
                                            <PauseCircleOutlineOutlinedIcon />
                                        }
                                        label="Stop"
                                    />
                                )}
                            </Grid>

                            {playing === 1 && (
                                <Grid
                                    flexGrow={1}
                                    width={'80%'}
                                    whiteSpace={'nowrap'}
                                    justifyContent={'flex-start'}
                                >
                                    {!listening ? (
                                        <Content color={'GrayText'}>
                                            {' '}
                                            <ResultComponent
                                                speech={SpeechedText}
                                                result={transformedWordResult}
                                            />
                                        </Content>
                                    ) : (
                                        <Content color={'GrayText'}>
                                            Listening...
                                        </Content>
                                    )}
                                </Grid>
                            )}
                        </Stack>
                    </CardContent>

                    <CardContent sx={{ width: '95%' }}>
                        <SubHeader>Answer :</SubHeader>
                        <Content
                            color={isSpeaked.answer ? 'GrayText' : '#BB86FC'}
                        >
                            {texttospeechaudio && playing === 2 ? (
                                <>
                                    <ReactAudioPlayer
                                        src={texttospeechaudio}
                                        controls
                                        autoPlay
                                        style={{ display: 'none' }}
                                    />
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
                                        <VolumeUpIcon color="primary" />
                                    </IconButton>
                                </>
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
                            {DataQuizAndAnswers?.data?.answer}
                        </Content>
                        <Stack
                            mt={2}
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            width={'100%'}
                        >
                            <Grid
                                container
                                alignItems={'center'}
                                columnGap={1}
                                justifyContent={'flex-start'}
                            >
                                {!listeningAnswer ? (
                                    <Chip
                                        clickable={true}
                                        id="startaudio"
                                        onClick={toggleAnswerListen}
                                        icon={<KeyboardVoiceIcon />}
                                        label="Try now"
                                    />
                                ) : (
                                    <Chip
                                        onClick={toggleAnswerListen}
                                        id="stopaudio"
                                        icon={
                                            <PauseCircleOutlineOutlinedIcon />
                                        }
                                        label="Stop"
                                    />
                                )}
                            </Grid>

                            {playing === 2 && (
                                <Grid
                                    flexGrow={1}
                                    width={'80%'}
                                    whiteSpace={'nowrap'}
                                    justifyContent={'flex-start'}
                                >
                                    {!listeningAnswer ? (
                                        <Content color={'GrayText'}>
                                            {' '}
                                            <ResultComponent
                                                speech={SpeechedText}
                                                result={transformedAnswerResult}
                                            />
                                        </Content>
                                    ) : (
                                        <Content color={'GrayText'}>
                                            Listening...
                                        </Content>
                                    )}
                                </Grid>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
                <Stack
                    direction={'row'}
                    width={'80%'}
                    alignItems={'center'}
                    justifyContent={quizNo > 1 ? 'space-between' : 'flex-end'}
                >
                    {quizNo > 1 && (
                        <SecondaryButton
                            onClick={() => {
                                if (!quizNo <= 0) {
                                    settexttospeechaudio('');
                                    Cookies.set('quiznumber', quiznumber - 1);
                                    setQuizNo(quizNo - 1);
                                    setIsSpeaked({
                                        answer: false,
                                        question: false,
                                    });
                                    setFinalTranscript('');
                                }
                            }}
                        >
                            Previous
                        </SecondaryButton>
                    )}

                    <PrimaryButton
                        disabled={
                            DataQuizAndAnswers?.data?.totalQuestions <= quizNo
                        }
                        onClick={() => {
                            settexttospeechaudio('');
                            Cookies.set('quiznumber', quiznumber + 1);
                            setQuizNo(quizNo + 1);
                            setIsSpeaked({
                                answer: false,
                                question: false,
                            });
                            setFinalTranscript('');
                        }}
                    >
                        {' '}
                        {DataQuizAndAnswers?.data?.totalQuestions === quizNo
                            ? 'Completed'
                            : 'Next'}
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Container>
    );
};

export default HomeScreen;

const ResultComponent = ({ result, speech }) => {
    const { word_result_array } = result ? result : [];
    const speechArray = speech ? speech : [];

    const getWordColor = (word) => {
        if (word_result_array?.matched.includes(word)) {
            return 'green';
        } else if (word_result_array?.mismatched.includes(word)) {
            return 'red';
        } else if (word_result_array?.order.includes(word)) {
            return 'orange';
        }
        // Default color if word does not belong to any category
        return 'black';
    };

    return (
        <div>
            <p>
                {speechArray?.map((word, index) => (
                    <span key={index} style={{ color: getWordColor(word) }}>
                        {word}&nbsp;
                    </span>
                ))}
            </p>
        </div>
    );
};
