import {PersonaOptions} from '@nlux/core';

const avatarDom = document.createElement('span');
avatarDom.innerHTML = '🤖';

export const personaOptions: PersonaOptions = {
    assistant: {
        name: 'Fin Assistant',
        avatar: 'https://cdn-icons-png.flaticon.com/512/7049/7049276.png',
        tagline: 'Your friendly AI financial advisor',
    },
    user: {
        name: 'You',
        avatar: avatarDom,
    },
};
