export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {personaOptions} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  
  // Markdown parsing is enabled by default
  // No addtional configuration needed
  return (
    <AiChat
      adapter={adapter}
      personaOptions={personaOptions}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
