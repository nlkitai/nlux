export default `import {useState, useCallback} from 'react';
import {UserPersona, AssistantPersona} from '@nlux/react';

const optionsSelectorStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center'
};

export const assistantPersona: AssistantPersona = {
    name: 'HarryBotter',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
    tagline: 'Welcome to Hogwarts! How may I assist you today?'
};

export const userPersona: UserPersona = {
  name: 'Alex',
  avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
};
`;
