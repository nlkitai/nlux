import {PersonaOptions} from '@nlux/react';

export const personaOptions: PersonaOptions = {
    assistant: {
        name: 'Fin Assistant',
        avatar: 'https://cdn-icons-png.flaticon.com/512/7049/7049276.png',
        tagline: 'Your friendly AI financial advisor',
    },
    user: {
        name: 'You',
        // avatar: <span style={style}>🤑</span>,
        avatar: <img
            height="100%"
            src="https://www.thetrevorproject.org/wp-content/uploads/2021/11/TTP_YouthPortrait_YellowBackdrop_Elijah.jpg"
        />,
    },
};
