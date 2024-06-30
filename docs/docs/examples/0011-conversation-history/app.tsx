export default (colorMode: 'dark' | 'light') => `import { AiChat } from '@nlux/react';
import { useChatAdapter } from '@nlux/langchain-react';
import '@nlux/themes/nova.css';

import { personaOptions } from './personas';

export default () => {
  // LangServe adapter that connects to a demo LangChain Runnable API
  const adapter = useChatAdapter({ url: 'https://pynlux.api.nlkit.com/pirate-speak' });

  return (
    <AiChat
      initialConversation={[
        {
          role: 'user',
          message: 'What\\'s the capital of Antartica?'
        },
        {
          role: 'assistant',
          message: 'Arrr, matey! The **capital** of _Antarctica_ be none other than \`"Arrrctica"\`, where ye can find a jolly crew of penguins swashbuckling on icy seas!'
        }
      ]}
      adapter={ adapter }
      personaOptions={ personaOptions }
      displayOptions={{ colorScheme: '${colorMode}' }}
    />
  );
};`;
