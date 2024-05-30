export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';

export default () => {
  return (
    <AiChat
      adapter={streamAdapter}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;
