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
                {
                    icon: <span>📝</span>,
                    label: 'Write a poem',
                    prompt: 'Write a poem about the stars and magic, using the words "twinkle" and "sparkle".'
                },
                {
                    icon: 'https://content.nlkit.com/logos/nlkit.png',
                    prompt: 'What is your favorite color?'
                },
                {
                    prompt: 'When did you decide to become a magician?'
                }
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
