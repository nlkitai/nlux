export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat, AssistantPersona} from '@nlux/react';
import '@nlux/themes';
import {streamAdapter} from './adapter';
import {useDemoOptions, userPersona} from './setup';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  const [InteractiveDemoOptions, shouldUseAssistantPersona, showWelcomeMessage] = useDemoOptions();
  const assistantPersona: AssistantPersona = useMemo(() => ({
    name: 'HarryBotter',
    avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
    tagline: 'Welcome to Hogwarts! How may I assist you today?'
  }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <InteractiveDemoOptions />
      <AiChat
        conversationOptions={{
          showWelcomeMessage
        }}
        personaOptions={{
          assistant: shouldUseAssistantPersona ? assistantPersona : undefined,
          user: userPersona
        }}
        adapter={adapter}
        displayOptions={{colorScheme: '${colorMode}'}}
      />
    </div>
  );
};`;
