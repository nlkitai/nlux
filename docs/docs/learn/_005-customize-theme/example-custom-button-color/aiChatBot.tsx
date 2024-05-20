export default `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import './custom-nova-theme.css';
import {streamAdapter} from './adapter';
import {user, botStyle} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      className="custom-ai-chat-comp"
      adapter={adapter}
      personaOptions={{
        bot: {
          name: 'iBot',
          picture: <span style={botStyle}>🤖</span>,
          tagline: 'Your Genius AI Assistant'
        },
        user
      }}
      layoutOptions={{
        height: 320,
        maxWidth: 600
      }}
    />
  );
};`;
