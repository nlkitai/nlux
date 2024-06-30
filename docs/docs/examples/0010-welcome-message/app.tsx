export default (colorMode: 'dark' | 'light') => `import { useMemo } from 'react';
import { AiChat, AssistantPersona } from '@nlux/react';
import { useChatAdapter } from '@nlux/langchain-react';
import '@nlux/themes/nova.css';

import { useDemoOptions, userPersona } from './setup';

export default () => {
  const [ InteractiveDemoOptions, isOption1Checked, isOption2Checked ] = useDemoOptions();
  const assistantPersona: AssistantPersona = useMemo(() => ({
    name: 'HarryBotter',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
    tagline: 'Welcome to Hogwarts! How may I assist you today?'
  }), []);

  const adapter = useChatAdapter({ url: 'https://pynlux.api.nlkit.com/pirate-speak' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <InteractiveDemoOptions />
      <AiChat
        conversationOptions={{
          // Possible values: true, false
          showWelcomeMessage: isOption2Checked
        }}
        personaOptions={{
          assistant: isOption1Checked ? assistantPersona : undefined,
          user: userPersona
        }}
        adapter={ adapter }
        displayOptions={{ colorScheme: '${colorMode}' }}
      />
    </div>
  );
};`;
