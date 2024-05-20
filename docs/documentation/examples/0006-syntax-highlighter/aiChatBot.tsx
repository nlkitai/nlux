export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import {highlighter} from '@nlux/highlighter';
import '@nlux/themes/nova.css';
import '@nlux/highlighter/dark-theme.css';
import {streamAdapter} from './adapter';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      adapter={adapter}
      syntaxHighlighter={highlighter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
