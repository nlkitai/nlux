export default (colorMode: 'dark' | 'light') => `import { AiChat, AiChatUI, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import { personas } from './personas';

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  return (
    <AiChat
      conversationOptions={{ layout: 'bubbles' }} personaOptions={ personas }
      displayOptions={{ colorScheme: '${colorMode}' }}
      adapter={ adapter }
    >
      <AiChatUI.Loader>
        <span className="rounded">Loading 🪐</span>
      </AiChatUI.Loader>
    </AiChat>
  );
};`;
