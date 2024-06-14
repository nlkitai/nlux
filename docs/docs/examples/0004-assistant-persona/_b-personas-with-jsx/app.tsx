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
