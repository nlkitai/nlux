export default (colorMode: 'dark' | 'light') => `import {AiChat} from '@nlux/react';
import {useChatAdapter} from '@nlux/langchain-react';
import '@nlux/themes/nova.css';
import {userPersona} from './personas';

export default () => {
  // LangServe adapter that connects to a demo LangChain Runnable API
  const adapter = useChatAdapter({
    url: 'https://pynlux.api.nlux.ai/pirate-speak'
  });

  return (
    <AiChat
      adapter={adapter}
      personaOptions={{
        assistant: {
          name: 'FeatherAssistant',
          avatar: 'https://nlux.ai/images/demos/persona-feather-assistant.png',
          tagline: 'Yer AI First Mate!'
        },
        user: userPersona
      }}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
