/* eslint-disable react/prop-types */
import { Stack } from '@mui/material';
import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../elements/buttonStyles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// eslint-disable-next-line react/prop-types
const ActionButtons = ({ quizNo, OnPrevious, onStartOver, onNext, DataQuizAndAnswers }) => {
     return (
          <Stack
               mt={{ xs: 5, sm: 5 }}
               columnGap={'10px'}
               rowGap={'10px'}
               mb={{ sm: 5, xs: 5 }}
               direction={{ sm: 'row' }}
               width={quizNo > 1 ? '80%' : '80%'}
               alignItems={'center'}
               justifyContent={quizNo > 1 ? 'space-between' : 'flex-end'}
          >
               {quizNo > 1 && (
                    <>
                         <PrimaryButton
                              onClick={OnPrevious}
                         >
                              <ArrowBackIcon /> Previous
                         </PrimaryButton>

                         <SecondaryButton
                              onClick={onStartOver}
                         >
                              start over
                         </SecondaryButton>
                    </>
               )}
               <PrimaryButton
                    disabled={DataQuizAndAnswers?.responseObj?.responseDataParams?.data?.totalQuestions <= quizNo}

                    onClick={onNext}
               >
                    {' '}
                    {DataQuizAndAnswers?.responseObj?.responseDataParams?.data?.totalQuestions === quizNo ? (
                         'Completed'
                    ) : (
                         <>
                              Next
                              <ArrowForwardIcon />
                         </>
                    )}
               </PrimaryButton>
          </Stack>
     );
};

export default ActionButtons;