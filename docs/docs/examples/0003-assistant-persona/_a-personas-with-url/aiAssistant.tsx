export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      personaOptions={{
        assistant: {
          name: 'HarryBotter',
          avatar: 'https://docs.nlkit.com/nlux/images/examples/harry-botter.png',
          tagline: 'Mischievously Making Magic With Mirthful AI!'
        },
        user
      }}
      adapter={adapter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
