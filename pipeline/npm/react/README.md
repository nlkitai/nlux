# NLUX REACT ✨💬

## Conversational AI UI Library For ChatGPT And Other LLMs

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** - High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** - `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - `ChatGPT` `HuggingFace` and an API to **Create Your Own Adapter** for any LLM.
* **Streaming LLM Output** - Streamed the chat response to the UI as it's being generated.
* **Syntax Highlighting** - Color code snippets in the response. **Copy And Paste** code into your editor.
* **Personalize The Conversation** - Provide context using system message, and instruct the LLM how to behave.
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
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research'
    });

    return (
        <AiChat
            adapter={gptAdapter}
            promptBoxOptions={{
                placeholder: 'Ask me anything about nuclear physics!'
            }}
        />
    );
}
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page
or import it in your React app.

## And The Result Is ✨

A fully functional chatbot UI that can advise you on nuclear physics, coding, and even tell you a joke or two!

[![NLUX AiChat Component](https://nlux.ai/images/demos/chat-convo-nobel-prize-in-physics-winner.gif)](https://nlux.ai)

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