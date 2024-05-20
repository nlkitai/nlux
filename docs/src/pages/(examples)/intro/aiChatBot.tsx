export default `import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {user, botPictureUrl} from './personas';

export default () => (
  <AiChat
    adapter={streamAdapter}
    personaOptions={{
      bot: {
        name: 'EinBot',
        tagline: 'Your Genius AI Assistant',
        picture: botPictureUrl,
      },
      user
    }}
    promptBoxOptions={{
      placeholder: 'How can I help you?'
    }}
    layoutOptions={{
      height: 350, maxWidth: 430
    }}
  />
);`;
