export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import { user } from './personas';

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  return (
    <AiChat
      personaOptions={{
        assistant: {
          name: 'HarryBotter',
          avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
          tagline: 'Mischievously Making Magic With Mirthful AI!'
        },
        user
      }}
      adapter={adapter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
