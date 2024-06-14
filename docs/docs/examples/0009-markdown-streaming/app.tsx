export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';
import { send } from './send';
import { personas } from './personas';

export default () => {
    const adapter = useAsStreamAdapter(send, []);
  
  // Markdown parsing is enabled by default
  // No addtional configuration needed
  // Just type a prompt that would result in a markdown response

  return (
    <AiChat
      adapter={ adapter }
      personaOptions={ personas }
      displayOptions={{ colorScheme: '${colorMode}' }}
    />
  );
};`;
