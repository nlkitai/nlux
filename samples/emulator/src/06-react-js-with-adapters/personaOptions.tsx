import {PersonaOptions} from '@nlux/react';

export const personaOptions: PersonaOptions = {
    assistant: {
        name: 'Fin Assistant',
        picture: 'https://cdn-icons-png.flaticon.com/512/7049/7049276.png',
        tagline: 'Your friendly AI financial advisor',
    },
    user: {
        name: 'You',
        // picture: <span style={style}>🤑</span>,
        picture: <img
            height="100%"
            src="https://www.thetrevorproject.org/wp-content/uploads/2021/11/TTP_YouthPortrait_YellowBackdrop_Elijah.jpg"
        />,
    },
};
