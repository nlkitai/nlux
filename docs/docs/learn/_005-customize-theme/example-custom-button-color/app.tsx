export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import {streamAdapter} from './adapter';
import {personas} from './personas';

// We import the unstyled CSS that gives us the basic layout and structure
import "@nlux/themes/unstyled.css";

// We set the variables in a separate CSS file
import "./theme-variables.css";

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      displayOptions={{
          themeId: "MyBrandName",
          colorScheme: "${colorMode}"
      }}
      personaOptions={ personas }
      adapter={ adapter }
    />
  );
};`;
