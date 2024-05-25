import {PersonaOptions} from '@nlux/core';

const pictureDom = document.createElement('span');
pictureDom.innerHTML = '🤖';

export const personaOptions: PersonaOptions = {
    assistant: {
        name: 'Fin Assistant',
        picture: 'https://cdn-icons-png.flaticon.com/512/7049/7049276.png',
        tagline: 'Your friendly AI financial advisor',
    },
    user: {
        name: 'You',
        picture: pictureDom,
    },
};
