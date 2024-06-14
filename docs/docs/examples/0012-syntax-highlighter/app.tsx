export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';
import { send } from './send';

// Importing the syntax highlighter and its dark theme
import {highlighter} from '@nlux/highlighter';
import '@nlux/highlighter/dark-theme.css';

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  return (
    <AiChat
      messageOptions={{ syntaxHighlighter: highlighter }}
      adapter={ adapter }
      displayOptions={{ colorScheme: '${colorMode}' }}
    />
  );
};`;
