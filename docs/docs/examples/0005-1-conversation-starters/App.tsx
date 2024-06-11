export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes';
import {streamAdapter} from './adapter';
import {userPersona, assistantPersona} from './setup';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
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
        adapter={adapter}
        displayOptions={{colorScheme: '${colorMode}'}}
      />
    </div>
  );
};`;
