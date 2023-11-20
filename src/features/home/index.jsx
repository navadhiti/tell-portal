import { Card, Container, Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Loader from '../../components/loader';
import { getQuestionAnswers, valueCalcuate } from './homeApi';
import Cookies from 'js-cookie';
import ResultDialog from '../../components/result';
import {
    femaleAudioAnswer,
    femaleVoiceQuestion,
    maleAudioAnswer,
    maleAudioQuestions,
} from './audioFiles';
import React from 'react';
import QuestionContent from './QuestionContent';
import AnswerContent from './AnswerContent';
import VoiceOptionButton from './VoiceOptionButton';
import ActionButtons from './ActionButtons';
import ResultComponent from '../../components/comparision';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const [voice, setVoice] = useState(localStorage.getItem('voice'));
    const audioQuestions = voice === 'male' ? maleAudioQuestions : femaleVoiceQuestion;
    const audioAnswers = voice === 'male' ? maleAudioAnswer : femaleAudioAnswer;

    const {
        data: DataQuizAndAnswers,
        isLoading,
        refetch,
    } = getQuestionAnswers(quiznumber);

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

                const data = valueCalcuate(DataQuizAndAnswers?.responseObj?.responseDataParams?.data
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
            stopRecording();
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
            stopRecording();
            recognitionAnswer.stop();
            setListeningAnswer(false);
            setOpen(true);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
            };
            mediaRecorder.start();
        } catch (error) {
            return error;
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === 'recording'
        ) {
            mediaRecorderRef.current.stop();
        }
    };

    useEffect(() => {
        if (listening == true) {
            handleListen();
            startRecording();
        }
        if (listeningAnswer == true) {
            handleAnswerListen();
            startRecording();
        }
    }, [listening, listeningAnswer]);

    useEffect(() => {
        refetch();
    }, [quizNo]);

    return (
        <Container>
            <Loader load={loading || isLoading} />

            <Grid
                mt={{ xs: 5, sm: 5 }}
                container
                justifyContent={'center'}
                alignItems={'center'}
                minHeight={'82vh'}
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

                    <VoiceOptionButton
                        voice={voice}
                        onMachineSelect={() => {
                            setVoice('machine');
                            localStorage.setItem('voice', 'machine');
                            setPlaying(0);
                        }}
                        onFemaleSelect={() => {
                            setVoice('female');
                            localStorage.setItem('voice', 'female');
                            setPlaying(0);
                        }}
                        onMaleSelect={() => {
                            setVoice('male');
                            localStorage.setItem('voice', 'male');
                            setPlaying(0);
                        }}
                    />

                    <QuestionContent
                        isSpeaked={isSpeaked}
                        texttospeechaudio={texttospeechaudio}
                        playing={playing}
                        voice={voice}
                        audioQuestions={audioQuestions}
                        DataQuizAndAnswers={DataQuizAndAnswers}
                        listening={listening}
                        toggleListen={toggleListen}
                        SpeechedText={SpeechedText}
                        transformedWordResult={transformedWordResult}
                        onClickListen={() => {
                            setPlaying(1);
                            setIsSpeaked({
                                ...isSpeaked, question: true,
                            });
                            convertai4bharat(
                                DataQuizAndAnswers?.responseObj?.responseDataParams?.data
                                    ?.question
                            );
                        }}
                    />

                    <AnswerContent
                        isSpeaked={isSpeaked}
                        texttospeechaudio={texttospeechaudio}
                        playing={playing}
                        voice={voice}
                        audioAnswers={audioAnswers}
                        DataQuizAndAnswers={DataQuizAndAnswers}
                        listeningAnswer={listeningAnswer}
                        SpeechedText={SpeechedText}
                        transformedAnswerResult={transformedAnswerResult}
                        toggleAnswerListen={toggleAnswerListen}
                        answerListen={() => {
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
                    />

                </Card>


                <ActionButtons
                    quizNo={quizNo}
                    DataQuizAndAnswers={DataQuizAndAnswers}
                    onNext={() => {
                        settexttospeechaudio('');
                        Cookies.set('quiznumber', quiznumber + 1);
                        setQuizNo(quizNo + 1);
                        setIsSpeaked({
                            answer: false,
                            question: false,
                        });
                        setFinalTranscript('');
                    }}

                    onStartOver={() => {
                        settexttospeechaudio('');
                        Cookies.set('quiznumber', 1);
                        setQuizNo(1);
                        setIsSpeaked({
                            answer: false,
                            question: false,
                        });
                        setFinalTranscript('');
                    }}

                    OnPrevious={() => {
                        if (!quizNo <= 0) {
                            settexttospeechaudio('');
                            Cookies.set('quiznumber', quiznumber - 1
                            );
                            setQuizNo(quizNo - 1);
                            setIsSpeaked({
                                answer: false,
                                question: false,
                            });
                            setFinalTranscript('');
                        }
                    }}
                />

            </Grid>

            <ResultDialog
                open={open}
                percentage={resultInPercentage}
                handleClose={() => setOpen(false)}
                content={
                    playing === 1
                        ? DataQuizAndAnswers?.responseObj?.responseDataParams
                            ?.data?.question
                        : DataQuizAndAnswers?.responseObj?.responseDataParams
                            ?.data?.answer
                }
                audioBlob={audioBlob}
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
