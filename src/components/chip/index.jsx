import React from 'react';
import Chip from '@mui/material/Chip';

const VoiceChip = ({ label, isSelected, onClick }) => {
  return (
    <Chip
      label={label}
      size='small'
      color={isSelected ? 'info' : 'primary'}
      sx={{ fontWeight: 'bold',color:isSelected === true && 'white' }}
      variant={isSelected ? 'filled' : 'outlined'}
      onClick={onClick}
    />
  );
};

export default VoiceChip;
