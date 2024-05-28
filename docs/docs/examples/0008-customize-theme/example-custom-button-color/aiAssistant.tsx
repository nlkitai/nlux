export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {personas} from './personas';

// Theme variable overrides are defined in theme-overrides.css
import './theme-overrides.css';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      // We can use the 'my-theme' class to increase specificity
      // and override the default theme variables
      className="my-theme"
      conversationOptions={{layout: 'bubbles'}}
      displayOptions={{colorScheme: 'dark'}}
      personaOptions={personas}
      adapter={adapter}
    />
  );
};`;
