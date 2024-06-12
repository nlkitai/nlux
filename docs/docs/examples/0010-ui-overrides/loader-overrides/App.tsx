export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat, AiChatUI} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {personas} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      conversationOptions={{layout: 'bubbles'}}
      displayOptions={{colorScheme: '${colorMode}'}}
      personaOptions={personas}
      adapter={adapter}
    >
        <AiChatUI.Loader><span className="rounded">Loading 🪐</span></AiChatUI.Loader>
    </AiChat>
  );
};`;
