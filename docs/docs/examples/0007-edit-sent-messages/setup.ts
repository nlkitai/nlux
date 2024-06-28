export default `import { PersonaOptions } from '@nlux/react';

export const personaOptions: PersonaOptions = {
  assistant: {
    name: 'Feather-AI',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/feather.png',
    tagline: 'Your AI Parrot Assistant',
  },
  user: {
    name: 'Alex',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
  }
};

export const initialConversation = [
    {
        role: 'user',
        message: 'Where do pirates keep their treasure?'
    },
    {
        role: 'assistant',
        message: 'In a treasure chest, matey!'
    }
];

export const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

export const instructionStyle = {
    textAlign: 'center',
    marginBottom: '5px',
    color: 'white',
    backgroundColor: 'black',
    padding: '10px 5px',
    borderRadius: '5px',
    fontSize: '14px',
    lineHeight: '1.5',
};

export const chatContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '350px',
    gap: '10px',
}

`;
