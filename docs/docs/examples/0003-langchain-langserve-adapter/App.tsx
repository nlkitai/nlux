export default (colorMode: 'dark' | 'light') => `import {AiChat} from '@nlux/react';
import {useChatAdapter} from '@nlux/langchain-react';
import '@nlux/themes/nova.css';
import {personasOptions} from './personas';

export default () => {
  // LangServe adapter that connects to a demo LangChain Runnable API
  // It fetches data in streaming mode
  const adapter = useChatAdapter({
    url: 'https://pynlux.api.nlkit.com/pirate-speak',
    dataTransferMode: 'stream'
  });

  return (
    <AiChat
      adapter={adapter}
      personaOptions={personasOptions}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
