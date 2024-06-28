export default (colorMode: 'dark' | 'light') => `import { useCallback, useState } from 'react';
import { AiChat, useAiChatApi } from '@nlux/react';
import { useChatAdapter } from '@nlux/langchain-react';
import * as setup from './setup';
import '@nlux/themes/nova.css';

export default () => {
  const adapter = useChatAdapter({ url: 'https://pynlux.api.nlkit.com/pirate-speak' });

  // Use the AiChat API reference to pass to <AiChat />
  const api = useAiChatApi();

  return (
    <div style={ setup.containerStyle }>
      <span style={ setup.instructionStyle }>
        Click on any user message in the conversation to edit it.<br />
        Press <strong>Enter</strong> to submit and press <strong>Escape</strong> to cancel editing.
      </span>
      <div style={ setup.chatContainerStyle }>
        <AiChat
          messageOptions={{
              editableUserMessages: true
          }}
          api={ api }
          adapter={ adapter }
          initialConversation={ setup.initialConversation }
          personaOptions={ setup.personaOptions }
          displayOptions={{ colorScheme: '${colorMode}' }}
        />
      </div>
    </div>
  );
};
`;
