export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import { personas } from './personas';

export default () => {
    const adapter = useAsStreamAdapter(send, []);
    return (
        <AiChat
            adapter={ adapter }
            personaOptions={ personas }
            displayOptions={{ colorScheme: '${colorMode}' }}
        />
    );
};`;
