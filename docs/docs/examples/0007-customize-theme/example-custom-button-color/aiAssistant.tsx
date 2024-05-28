export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import './custom-nova-theme.css';
import {streamAdapter} from './adapter';
import {personas} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      // Theme variable overrides are defined in custom-nova-theme.css
      // and they are applied to the chat UI by adding the 'my-theme' class
      // This enables more specificity in the CSS selectors
      className="my-theme"
      conversationOptions={{layout: 'bubbles'}}
      displayOptions={{colorScheme: 'dark'}}
      personaOptions={personas}
      adapter={adapter}
    />
  );
};`;
