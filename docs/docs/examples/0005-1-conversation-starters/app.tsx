export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import { userPersona, assistantPersona } from './setup';

export default () => {
  const adapter = useAsStreamAdapter(send, []);

  return (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', height: '90vh' }}>
      <AiChat
        conversationOptions={{
            conversationStarters: [
                {prompt: 'Write a poem using markdown and emojis'},
                {prompt: 'What is your name?'},
                {prompt: 'What is your favorite color?'}
            ]
        }}
        personaOptions={{
          assistant: assistantPersona,
          user: userPersona
        }}
        adapter={ adapter }
        displayOptions={{ colorScheme: '${colorMode}' }}
      />
    </div>
  );
};`;
