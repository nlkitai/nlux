export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user, assistantCssStyle} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      personaOptions={{
        assistant: {
          name: 'Emo\\'jsx',
          avatar: <span style={assistantCssStyle}>🤖</span>,
          tagline: 'Your Robotic AI Assistant'
        },
        user
      }}
      adapter={adapter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};
`;
