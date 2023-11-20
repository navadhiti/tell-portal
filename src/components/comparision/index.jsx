import React from 'react';
import { Content } from '../../elements/textStyles';

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
export default ResultComponent;