export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';

import {highlighter} from '@nlux/highlighter';
import '@nlux/highlighter/dark-theme.css';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      messageOptions={{
        syntaxHighlighter: highlighter
      }}
      adapter={adapter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
