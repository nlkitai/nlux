export default (colorMode: 'dark' | 'light') => `import { useCallback, useState } from 'react';
import { AiChat, useAiChatApi } from '@nlux/react';
import { useChatAdapter } from '@nlux/langchain-react';
import * as setup from './setup';
import LastMessage from './lastMessage';
import '@nlux/themes/nova.css';

export default () => {
  const adapter = useChatAdapter({ url: 'https://pynlux.api.nlkit.com/pirate-speak' });
  const [lastMessageReceived, setLastMessageReceived] = useState('');

  // Use the AiChat API reference to pass to <AiChat />
  const api = useAiChatApi();

  // Callbacks that use the API
  const onResetClick = useCallback(() => api.conversation.reset(), [api]);
  const onSendClick = useCallback(() => api.composer.send('Where can I find this treasure chest?'), [api]);
  const onMessageReceived = useCallback((payload) => setLastMessageReceived(payload.message), [setLastMessageReceived]);

  return (
    <div style={ setup.containerStyle }>
      <div style={ setup.buttonsContainerStyle }>
        <button style={ setup.buttonStyle } onClick={ onSendClick }>Send</button>
        <button style={ setup.buttonStyle } onClick={ onResetClick }>Reset</button>
      </div>
      <div style={ setup.chatContainerStyle }>
        <AiChat
          api={ api }
          adapter={ adapter }
          events={{ messageReceived: onMessageReceived }}
          initialConversation={ setup.initialConversation }
          personaOptions={ setup.personaOptions }
          displayOptions={{ colorScheme: '${colorMode}' }}
        />
        <LastMessage message={ lastMessageReceived } />
      </div>
    </div>
  );
};
`;
