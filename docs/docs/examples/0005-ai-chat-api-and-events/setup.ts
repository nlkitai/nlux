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

export const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '5px',
};

export const buttonStyle = {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
};

export const chatContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '350px',
    gap: '10px',
}

export const lastMessageReceivedStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    marginTop: '10px',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px',
    width: '200px',
}

`;
