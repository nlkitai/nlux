export default `import {PersonaOptions} from '@nlux/react';

const assistantCssStyle = {
  background: 'linear-gradient(#4a8582, #00ffbf)',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%'
};

export const personas: PersonaOptions = {
   assistant: {
    name: 'iAssistant',
    avatar: <span style={assistantCssStyle}>🤖</span>,
    tagline: 'Your Genius AI Assistant'
  },
  user: {
    name: 'Alex',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
  }
};
`;
