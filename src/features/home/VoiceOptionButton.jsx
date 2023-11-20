import { Stack } from '@mui/material';
import React from 'react';
import { SubHeader } from '../../elements/textStyles';
import VoiceChip from '../../components/chip';

// eslint-disable-next-line react/prop-types
const VoiceOptionButton = ({ voice, onFemaleSelect, onMachineSelect, onMaleSelect }) => {
     return (
          <Stack
               columnGap={'10px'}
               rowGap={'10px'}
               direction={{ sm: 'row' }}
               width={'95%'}
               alignItems={'center'}
               justifyContent={'flex-start'}
               padding={'10px'}
          >
               <SubHeader>Voices:</SubHeader>

               <VoiceChip
                    label="Machine"
                    isSelected={voice === 'machine'}
                    onClick={onMachineSelect}
               />
               <VoiceChip
                    label="Female"
                    isSelected={voice === 'female'}
                    onClick={onFemaleSelect}
               />
               <VoiceChip
                    label="Male"
                    isSelected={voice === 'male'}
                    onClick={onMaleSelect}
               />
          </Stack>
     );
};

export default VoiceOptionButton;