export default `import {PersonaOptions} from '@nlux/react';

const assistantAvatar = 'https://docs.nlkit.com/nlux/images/docs/examples/assistant-persona-hawking.png';
const userAvatar = 'https://docs.nlkit.com/nlux/images/docs/examples/user-persona-marissa.png';

export const personas: PersonaOptions = {
    assistant: {
        name: 'HawkingAssistant',
        avatar: assistantAvatar,
        tagline: 'Outsmarts Einstein and E.T',
    },
    user: {
        name: 'Marissa',
        avatar: userAvatar,
    }
};`;
