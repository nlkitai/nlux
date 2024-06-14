export default (colorScheme: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import { user, assistantAvatar } from './personas';

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  return (
    <AiChat
      adapter={adapter}
      personaOptions={{
        assistant: {
          name: "EinAssistant",
          tagline: "Your Genius AI Assistant",
          avatar: assistantAvatar
        },
        user
      }}
      composerOptions={{ placeholder: "Type your query" }}
      conversationOptions={{ layout: 'bubbles' }}
      displayOptions={{ colorScheme: "dark" }}
    />
  );
};
`;
