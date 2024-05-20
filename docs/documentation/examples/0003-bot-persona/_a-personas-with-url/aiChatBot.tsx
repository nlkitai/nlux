export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      adapter={adapter}
      personaOptions={{
        bot: {
          name: 'HarryBotter',
          picture: 'https://nlux.ai/images/demos/persona-harry-botter.jpg',
          tagline: 'Mischievously Making Magic With Mirthful AI!',
        },
        user
      }}
        displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
