export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user, botStyle} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      adapter={adapter}
      personaOptions={{
        assistant: {
          name: 'iAssistant',
          picture: <span style={botStyle}>🤖</span>,
          tagline: 'Your Genius AI Assistant',
        },
        user
      }}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
