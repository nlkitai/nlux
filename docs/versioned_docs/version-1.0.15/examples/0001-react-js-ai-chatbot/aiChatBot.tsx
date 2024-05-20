export default `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import {streamAdapter} from './adapter';
import {personas} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      adapter={adapter}
      personaOptions={personas}
      layoutOptions={{
        height: 320,
        maxWidth: 600
      }}
    />
  );
};`;
