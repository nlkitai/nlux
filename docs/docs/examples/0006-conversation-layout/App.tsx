export default (colorMode: 'dark' | 'light') => `import {useState, useCallback} from 'react';
import {AiChat} from '@nlux/react';
import {useChatAdapter} from '@nlux/langchain-react';
import '@nlux/themes/nova.css';
import {personaOptions, conversationHistory} from './setup';
import {useLayoutOptions, LayoutSelector} from './layout';

export default () => {
  // LangServe adapter that connects to a demo LangChain Runnable API
  const adapter = useChatAdapter({url: 'https://pynlux.api.nlkit.com/pirate-speak'});

  // Utility hook to manage conversation layout options
  const {conversationLayout, onConversationsLayoutChange} = useLayoutOptions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <LayoutSelector
        conversationLayout={conversationLayout}
        onConversationsLayoutChange={onConversationsLayoutChange}
      />
      <AiChat
        conversationOptions={{
            // Possible values: 'list' or 'bubbles'
            layout: conversationLayout
        }}
        adapter={adapter}
        initialConversation={conversationHistory}
        personaOptions={personaOptions}
        displayOptions={{colorScheme: '${colorMode}'}}
      />
    </div>
  );
};`;
