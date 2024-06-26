export default `import { PersonaOptions, ChatItem } from '@nlux/react';

export const personaOptions: PersonaOptions = {
  assistant: {
    name: 'Feather-AI',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/feather.png',
    tagline: 'Yer AI First Mate!',
  },
  user: {
    name: 'Alex',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
  }
};

export const conversationHistory: ChatItem[] = [
  {
    role: 'user',
    message: 'What\\'s the capital of Antartica?'
  },
  {
    role: 'assistant',
    message: 'Arrr, matey! The capital of Antarctica be none other than "Arrrctica," where ye can find a jolly crew of penguins swashbuckling on icy seas!'
  }
];
`;
