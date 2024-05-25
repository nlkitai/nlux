export default (colorScheme: 'dark' | 'light') => `import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user, assistantAvatar} from './personas';

export default () => (
  <AiChat
    adapter={streamAdapter}
    personaOptions={{
      assistant: {
        name: 'EinAssistant',
        tagline: 'Your Genius AI Assistant',
        avatar: assistantAvatar
      },
      user
    }}
    composerOptions={{
      placeholder: 'How can I help you?'
    }}
    displayOptions={{
      height: 350, maxWidth: 430,
      colorScheme: '${colorScheme}'
    }}
  />
);`;
