export default `import {AiChat} from '@nlux/react';
import {useChatAdapter} from '@nlux/langchain-react';
import '@nlux/themes/nova.css';

export default () => {
  // LangServe adapter that connects to a demo LangChain Runnable API
  const adapter = useChatAdapter({
    url: 'https://pynlux.api.nlkit.com/pirate-speak',
    dataTransferMode: 'batch'
  });

  return (
    <AiChat
      adapter={adapter}
      personaOptions={{
        assistant: {
          name: 'Feather-AI',
          avatar: 'https://docs.nlkit.com/nlux/images/docs/examples/feather.png',
          tagline: 'Yer AI First Mate!'
        },
        user: {
          name: 'Alex',
          avatar: 'https://docs.nlkit.com/nlux/images/docs/examples/alex.png'
        }
      }}
      layoutOptions={{
        height: 320,
        maxWidth: 600
      }}
    />
  );
};`;
