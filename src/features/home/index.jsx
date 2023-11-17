import {
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    MenuList,
    Radio,
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
import ResultDialog from '../../components/result';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    femaleAudioAnswer,
    femaleVoiceQuestion,
    maleAudioAnswer,
    maleAudioQuestions,
} from './audioFiles';
import React from 'react';
import VoiceChip from '../../components/chip';

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-IN';

const SpeechRecognitiona =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionAnswer = new SpeechRecognitiona();
recognitionAnswer.continuous = true;
recognitionAnswer.interimResults = true;
recognitionAnswer.lang = 'en-IN';

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

    const [playing, setPlaying] = useState(0);
    const [loading, setLoading] = useState(false);
    const {
        data: DataQuizAndAnswers,
        isLoading,
        refetch,
    } = getQuestionAnswers(quiznumber);

    const [listening, setListening] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [transformedWordResult, setTransformedWordResult] = useState(null);
    const [listeningAnswer, setListeningAnswer] = useState(false);
    const [transformedAnswerResult, setTransformedAnswerResult] = useState(null);
    const SpeechedText = finalTranscript.split(' ');
    const [resultInPercentage, setResultInPercentage] = useState();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [voice, setVoice] = useState(localStorage.getItem('voice'));
    const audioQuestions = voice === 'male' ? maleAudioQuestions : femaleVoiceQuestion;
    const audioAnswers = voice === 'male' ? maleAudioAnswer : femaleAudioAnswer;
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const convertai4bharat = (propText) => {
        setListening(false);
        setListeningAnswer(false);
        setLoading(true);
        setFinalTranscript('');
        settexttospeechaudio('');
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        var payload = JSON.stringify({
            controlConfig: { dataTracking: true },
            input: [{ source: propText }],
            config: {
                gender: 'female',
                language: { sourceLanguage: 'en' },
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
        if (listening == true) {
            setLoading(true);
            recognition.start();
            recognition.onstart = () => {
                // Do nothing on start
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
                    DataQuizAndAnswers?.responseObj?.responseDataParams?.data
                        ?.question,
                    final
                );
                setTransformedWordResult(data);
                const result_in_percentage =
                    data?.word_result_array?.order?.length !== 0 &&
                        data?.result_in_percentage === 100
                        ? '90'
                        : data?.result_in_percentage;
                setResultInPercentage(result_in_percentage);
                setLoading(false);
            };

            recognition.onerror = () => {
                recognition.stop(); // Stop recognition on error
                setLoading(false);
            };
        }
    };

    const handleAnswerListen = () => {
        setLoading(true);
        if (listeningAnswer == true) {
            recognitionAnswer.start();
            recognitionAnswer.onstart = () => {
                // Do nothing on start
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

                const data = valueCalcuate(
                    DataQuizAndAnswers?.responseObj?.responseDataParams?.data
                        ?.answer,
                    final
                );
                setTransformedAnswerResult(data);
                const result_in_percentage =
                    data?.word_result_array?.order?.length !== 0 &&
                        data?.result_in_percentage === 100
                        ? '93'
                        : data?.result_in_percentage;
                setResultInPercentage(result_in_percentage);
                setLoading(false);
            };

            recognitionAnswer.onerror = () => {
                recognitionAnswer.stop(); // Stop recognitionAnswer on error
                setLoading(false);
            };
        }
    };

    const toggleListen = () => {
        setResultInPercentage();
        settexttospeechaudio('');
        setFinalTranscript('');
        setPlaying(1);
        setListening(!listening);
        if (listening == true) {
            recognition.stop();
            setListening(false);
            setOpen(true);
        }
    };

    const toggleAnswerListen = () => {
        setResultInPercentage();
        settexttospeechaudio('');
        setFinalTranscript('');
        setPlaying(2);
        setListeningAnswer(!listeningAnswer);
        if (listeningAnswer == true) {
            recognitionAnswer.stop();
            setListeningAnswer(false);
            setOpen(true);
        }
    };

    useEffect(() => {
        if (listening == true) {
            handleListen();
        }
    }, [listening]);

    useEffect(() => {
        if (listeningAnswer == true) {
            handleAnswerListen();
        }
    }, [listeningAnswer]);

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

                    <Stack
                        columnGap={'10px'}
                        rowGap={'10px'}
                        direction={{ sm: 'row' }}
                        width={'95%'}
                        alignItems={'center'}
                        justifyContent={'flex-start'}
                        padding={'10px'}
                    ><SubHeader>Voices:</SubHeader>

                        <VoiceChip
                            label="Machine"
                            isSelected={voice === 'machine'}
                            onClick={() => {
                                setVoice('machine');
                                localStorage.setItem('voice', 'machine');
                                setPlaying(0);
                            }}
                        />
                         <VoiceChip
                            label="Female"
                            isSelected={voice === 'female'}
                            onClick={() => {
                                setVoice('female');
                                localStorage.setItem('voice', 'female');
                                setPlaying(0);
                            }}
                        />
                         <VoiceChip
                            label="Male"
                            isSelected={voice === 'male'}
                            onClick={() => {
                                setVoice('male');
                                localStorage.setItem('voice', 'male');
                                setPlaying(0);
                            }}
                        />
                        
                    </Stack>

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
                            {' '}
                            {texttospeechaudio && playing === 1 ? (
                                <>{
                                    voice === 'machine' ? <>  <ReactAudioPlayer
                                        src={texttospeechaudio}
                                        controls
                                        autoPlay
                                        style={{ display: 'none' }}
                                    /></> : <>
                                        {audioQuestions.map((data, index) => {
                                            return (
                                                data.id ===
                                                DataQuizAndAnswers?.responseObj
                                                    ?.responseDataParams?.data
                                                    ?._id && (
                                                    <ReactAudioPlayer
                                                        key={index}
                                                        src={data?.mp3File}
                                                        controls
                                                        autoPlay
                                                        style={{ display: 'none' }}
                                                    />
                                                )
                                            );
                                        })} </>

                                }

                                    <Chip
                                        onClick={() => {
                                            setPlaying(1);
                                            setIsSpeaked({
                                                ...isSpeaked,
                                                question: true,
                                            });

                                            convertai4bharat(
                                                DataQuizAndAnswers?.responseObj
                                                    ?.responseDataParams?.data
                                                    ?.question
                                            );
                                        }}
                                        icon={
                                            <VolumeUpIcon fontSize="medium" />
                                        }
                                        label="Listen"
                                        color="primary"
                                    />
                                </>
                            ) : (
                                <Chip
                                    onClick={() => {
                                        setPlaying(1);
                                        setIsSpeaked({
                                            ...isSpeaked,
                                            question: true,
                                        });
                                        convertai4bharat(
                                            DataQuizAndAnswers?.responseObj
                                                ?.responseDataParams?.data
                                                ?.question
                                        );
                                    }}
                                    icon={<VolumeUpIcon fontSize="medium" />}
                                    label="Listen"
                                    color="primary"
                                />
                            )}
                            <span>
                                {' '}
                                {
                                    DataQuizAndAnswers?.responseObj
                                        ?.responseDataParams?.data?.question
                                }
                            </span>
                        </Content>

                        <Grid
                            container
                            mt={2}
                            width={'100%'}
                            justifyContent={'flex-start'}
                        >
                            <Grid item md={2} sm={12} xs={12} lg={2}>
                                <Grid container>
                                    {!listening ? (
                                        <Chip
                                            color="secondary"
                                            id="startaudio"
                                            onClick={toggleListen}
                                            icon={
                                                <KeyboardVoiceIcon fontSize="medium" />
                                            }
                                            sx={{ fontWeight: 'bold' }}
                                            label="Try now"
                                        />
                                    ) : (
                                        <Chip
                                            color="primary"
                                            onClick={toggleListen}
                                            id="stopaudio"
                                            icon={
                                                <PauseCircleOutlineOutlinedIcon fontSize="medium" />
                                            }
                                            label="Stop"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Grid>
                            </Grid>

                            <Grid item md={10} sm={12} xs={12} lg={10}>
                                <Grid container>
                                    {playing === 1 && (
                                        <>
                                            {!listening ? (
                                                <ResultComponent
                                                    speech={SpeechedText}
                                                    result={
                                                        transformedWordResult
                                                    }
                                                />
                                            ) : (
                                                <Content color={'GrayText'}>
                                                    Listening...
                                                </Content>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <CardContent sx={{ width: '95%' }}>
                        <SubHeader>Answer :</SubHeader>
                        <Content
                            color={isSpeaked.answer ? 'GrayText' : '#034EA1'}
                        >
                            {texttospeechaudio && playing === 2 ? (
                                <>{
                                    voice === 'machine' ? <> <ReactAudioPlayer
                                        src={texttospeechaudio}
                                        controls
                                        autoPlay
                                        style={{ display: 'none' }}
                                    /></> : <>
                                        {audioAnswers.map((data, index) => {
                                            return (
                                                data.id ===
                                                DataQuizAndAnswers?.responseObj
                                                    ?.responseDataParams?.data
                                                    ?._id && (
                                                    <ReactAudioPlayer
                                                        key={index}
                                                        src={data.mp3File}
                                                        controls
                                                        autoPlay
                                                        style={{ display: 'none' }}
                                                    />
                                                )
                                            );
                                        })}
                                    </>
                                }

                                    <Chip
                                        onClick={() => {
                                            settexttospeechaudio('');
                                            setPlaying(2);
                                            setIsSpeaked({
                                                ...isSpeaked,
                                                answer: true,
                                            });
                                            convertai4bharat(
                                                DataQuizAndAnswers?.responseObj
                                                    ?.responseDataParams?.data
                                                    ?.answer
                                            );
                                        }}
                                        icon={
                                            <VolumeUpIcon fontSize="medium" />
                                        }
                                        label="Listen"
                                        color="primary"
                                    />
                                </>
                            ) : (
                                <Chip
                                    onClick={() => {
                                        settexttospeechaudio('');
                                        setPlaying(2);
                                        setIsSpeaked({
                                            ...isSpeaked,
                                            answer: true,
                                        });
                                        convertai4bharat(
                                            DataQuizAndAnswers?.responseObj
                                                ?.responseDataParams?.data
                                                ?.answer
                                        );
                                    }}
                                    icon={<VolumeUpIcon fontSize="medium" />}
                                    label="Listen"
                                    color="primary"
                                />
                            )}
                            <span>
                                {' '}
                                {
                                    DataQuizAndAnswers?.responseObj
                                        ?.responseDataParams?.data?.answer
                                }{' '}
                            </span>
                        </Content>

                        <Grid
                            container
                            mt={2}
                            width={'100%'}
                            justifyContent={'flex-start'}
                        >
                            <Grid item md={2} sm={12} xs={12} lg={2}>
                                <Grid container>
                                    {!listeningAnswer ? (
                                        <Chip
                                            color="secondary"
                                            clickable={true}
                                            id="startaudio"
                                            onClick={toggleAnswerListen}
                                            icon={
                                                <KeyboardVoiceIcon fontSize="medium" />
                                            }
                                            sx={{ fontWeight: 'bold' }}
                                            label="Try now"
                                        />
                                    ) : (
                                        <Chip
                                            color="primary"
                                            onClick={() => {
                                                toggleAnswerListen();
                                            }}
                                            id="stopaudio"
                                            icon={
                                                <PauseCircleOutlineOutlinedIcon fontSize="medium" />
                                            }
                                            label="Stop"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Grid>
                            </Grid>

                            <Grid item md={10} sm={12} xs={12} lg={10}>
                                <Grid container>
                                    {playing === 2 && (
                                        <>
                                            {!listeningAnswer ? (
                                                <ResultComponent
                                                    speech={SpeechedText}
                                                    result={
                                                        transformedAnswerResult
                                                    }
                                                />
                                            ) : (
                                                <Content color={'GrayText'}>
                                                    Listening...
                                                </Content>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Stack
                    columnGap={'10px'}
                    rowGap={'10px'}
                    direction={{ sm: 'row' }}
                    width={quizNo > 1 ? '80%' : '80%'}
                    alignItems={'center'}
                    justifyContent={quizNo > 1 ? 'space-between' : 'flex-end'}
                >
                    {quizNo > 1 && (
                        <>
                            <PrimaryButton
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
                                        setFinalTranscript('');
                                    }
                                }}
                            >
                                <ArrowBackIcon /> Previous
                            </PrimaryButton>

                            <SecondaryButton
                                onClick={() => {
                                    settexttospeechaudio('');
                                    Cookies.set('quiznumber', 1);
                                    setQuizNo(1);
                                    setIsSpeaked({
                                        answer: false,
                                        question: false,
                                    });
                                    setFinalTranscript('');
                                }}
                            >
                                start over
                            </SecondaryButton>
                        </>
                    )}
                    <PrimaryButton
                        disabled={
                            DataQuizAndAnswers?.responseObj?.responseDataParams
                                ?.data?.totalQuestions <= quizNo
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
                        {DataQuizAndAnswers?.responseObj?.responseDataParams
                            ?.data?.totalQuestions === quizNo ? (
                            'Completed'
                        ) : (
                            <>
                                Next
                                <ArrowForwardIcon />
                            </>
                        )}
                    </PrimaryButton>
                </Stack>
            </Grid>

            <ResultDialog
                open={open}
                percentage={resultInPercentage}
                handleClose={handleClose}
            >
                {playing == 1 ? (
                    <ResultComponent
                        speech={SpeechedText}
                        result={transformedWordResult}
                    />
                ) : (
                    <ResultComponent
                        speech={SpeechedText}
                        result={transformedAnswerResult}
                    />
                )}
            </ResultDialog>
        </Container>
    );
};

export default HomeScreen;

// eslint-disable-next-line react/prop-types
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
        return 'green';
    };

    return (
        <>
            {speechArray?.map((word, index) => (
                <Content key={index} sx={{ color: getWordColor(word) }}>
                    {word}&nbsp;
                </Content>
            ))}
        </>
    );
};
