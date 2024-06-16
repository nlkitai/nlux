export default (colorMode: 'dark' | 'light') => `import { AiChat, useAsStreamAdapter } from "@nlux/react";
import { send } from "./send";
import { personas } from "./personas";

// We import the unstyled CSS that gives us the basic layout and structure
import "@nlux/themes/unstyled.css";

// We add theme variable overrides in theme-overrides.css
import "./theme-overrides.css";

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  return (
    <AiChat
      conversationOptions={{ layout: "bubbles" }}
      displayOptions={{ colorScheme: "dark" }}
      personaOptions={personas}
      adapter={adapter}
    />
  );
};
`;
