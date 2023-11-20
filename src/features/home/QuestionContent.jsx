/* eslint-disable react/prop-types */
import { CardContent, Chip, Grid } from '@mui/material';
import React from 'react';
import { Content, SubHeader } from '../../elements/textStyles';
import ReactAudioPlayer from 'react-audio-player';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const QuestionContent = ({ isSpeaked, texttospeechaudio, playing, voice, audioQuestions, DataQuizAndAnswers, listening, toggleListen, SpeechedText, transformedWordResult, onClickListen }) => {
     return (
          <CardContent
               sx={{
                    width: '95%',
                    backgroundColor: '#D9F0F4',
                    borderRadius: '5px',
               }}
          >
               <SubHeader>Question :</SubHeader>
               <Content
                    color={isSpeaked?.question ? 'GrayText' : '#034EA1'}
               >
                    {' '}
                    {texttospeechaudio && playing === 1 ? (
                         <>
                              {voice === 'machine' ? (
                                   <>
                                        {' '}
                                        <ReactAudioPlayer
                                             src={texttospeechaudio}
                                             controls
                                             autoPlay
                                             style={{ display: 'none' }}
                                        />
                                   </>
                              ) : (
                                   <>
                                        {audioQuestions.map(
                                             (data, index) => {
                                                  return (
                                                       data.id ===
                                                       DataQuizAndAnswers?.responseObj?.responseDataParams?.data?._id && (
                                                            <ReactAudioPlayer
                                                                 key={index}
                                                                 src={
                                                                      data?.mp3File
                                                                 }
                                                                 controls
                                                                 autoPlay
                                                                 style={{
                                                                      display:
                                                                           'none',
                                                                 }}
                                                            />
                                                       )
                                                  );
                                             }
                                        )}{' '}
                                   </>
                              )}

                              <Chip
                                   onClick={onClickListen}
                                   icon={
                                        <VolumeUpIcon fontSize="medium" />
                                   }
                                   label="Listen"
                                   color="primary"
                              />
                         </>
                    ) : (
                         <Chip
                              onClick={onClickListen}
                              icon={<VolumeUpIcon fontSize="medium" />}
                              label="Listen"
                              color="primary"
                         />
                    )}
                    <span>
                         {' '}
                         {
                              DataQuizAndAnswers?.responseObj?.responseDataParams?.data?.question
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
                                             <>
                                                  <ResultComponent
                                                       speech={SpeechedText}
                                                       result={
                                                            transformedWordResult
                                                       }
                                                  />
                                             </>
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
     );
};

export default QuestionContent;






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
