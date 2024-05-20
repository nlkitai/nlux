export default `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      adapter={adapter}
      layoutOptions={{
        height: 360,
        maxWidth: 600
      }}
    />
  );
};`;
