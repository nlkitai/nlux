export default (colorMode: 'dark' | 'light') => `import { AiChat, ConversationLayout } from '@nlux/react';
import { useChatAdapter } from '@nlux/langchain-react';
import '@nlux/themes/nova.css';
import { personaOptions, conversationHistory } from './setup';
import { useLayoutOptions, LayoutSelector } from './layout';

export default () => {
  const adapter = useChatAdapter({ url: 'https://pynlux.api.nlkit.com/pirate-speak' });

  // Utility hook created for this example, to manage conversation layout options
  // Possible config values: 'bubbles' or 'list'
  const defaultLayout: ConversationLayout = 'bubbles';
  const { conversationLayout, onConversationsLayoutChange } = useLayoutOptions(defaultLayout);

  return (
    <div style={{ display: 'flex', width: '100%', flexDirection: 'column', height: '90vh' }}>
      <LayoutSelector
        conversationLayout={ conversationLayout }
        onConversationsLayoutChange={ onConversationsLayoutChange }
      />
      <AiChat
        conversationOptions={{
            // Possible config values: 'bubbles' or 'list'
            layout: conversationLayout
        }}
        adapter={ adapter }
        initialConversation={ conversationHistory }
        personaOptions={ personaOptions }
        displayOptions={{ colorScheme: '${colorMode}' }}
      />
    </div>
  );
};`;
