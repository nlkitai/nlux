# NLUX REACT ✨💬

## Conversational AI UI Library For ChatGPT And Other LLMs

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** - High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** - `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - `ChatGPT` `HuggingFace` and an API to **Create Your Own Adapter** for any LLM.
* **Bot and User Personas** - Customize the bot and user personas with names, images, and descriptions.
* **Streaming LLM Output** - Streamed the chat response to the UI as it's being generated.
* **Syntax Highlighting** - Color code snippets in the response. **Copy And Paste** code into your editor.
* **Personalized Conversation** - Provide context using system message, and instruct the LLM how to behave.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

## Docs Website 📖

Please visit [docs.nlux.ai](https://docs.nlux.ai/) for the full documentation and examples.

## Get Started With NLUX React and ChatGPT 🚀

Install and import dependencies:

```sh
npm install @nlux/react @nlux/openai-react
```

Then include `<AiChat />` in your React app to get started.<br />
Use the `useAdapter` hook to configure an adapter for your LLM.

```jsx
import {AiChat} from '@nlux/react';
import {useAdapter} from '@nlux/openai-react';

const App = () => {
    const gptAdapter = useAdapter({
        apiKey: 'YOUR_OPEN_AI_API_KEY',
        // 👇 Instruct ChatGPT how to behave (optional)
        systemMessage:
            'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. ' +
            'Only recommend legal, ethical practices. Be friendly. Write concise answers under 5 sentences.'
    });

    return (
        <AiChat
            adapter={gptAdapter}
            promptBoxOptions={{
                placeholder: 'How can I help you today?'
            }}
        />
    );
}
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page
or import it in your React app.

## And The Result Is ✨

An AI chatbot, experienced in personal finance, that can give your users sound, tailored financial advice:

[![Nlux AiChat Component](https://nlux.ai/images/demos/chat-convo-demo-fin-advisor.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
The recommended way for React developers is to install `@nlux/themes`

```sh
npm install @nlux/themes
```

Then import the theme CSS file into your app or component as follows:

```jsx
import '@nlux/themes/nova.css';
```

This requires that your bundler is configured to load CSS files.