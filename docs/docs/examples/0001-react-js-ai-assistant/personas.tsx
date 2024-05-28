export default `import {PersonaOptions} from '@nlux/react';

const personaAvatarBase = 'https://docs.nlkit.com/nlux/images/docs/examples/';

export const personas: PersonaOptions = {
    assistant: {
        name: 'HawkingAssistant',
        avatar: personaAvatarBase + 'assistant-persona-hawking.png',
        tagline: 'Outsmarts Einstein and E.T.',
    },
    user: {
        name: 'Marissa',
        avatar: personaAvatarBase + 'assistant-persona-marissa.png'
    }
};`;
