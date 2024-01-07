import {PersonaOptions} from '@nlux/core';

const pictureDom = document.createElement('span');
pictureDom.innerHTML = '🤖';

export const personaOptions: PersonaOptions = {
    bot: {
        name: 'Fin Bot',
        picture: 'https://cdn-icons-png.flaticon.com/512/7049/7049276.png',
        tagline: 'Your friendly AI financial advisor',
    },
    user: {
        name: 'You',
        picture: pictureDom,
    },
};
