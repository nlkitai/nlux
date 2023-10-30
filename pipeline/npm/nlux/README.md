# NLUX JS

## Build ChatGPT-powered Conversational AI UI ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build Custom ChatGPT Interfaces In Minutes** - Easily build chatbot and conversational interfaces with just a few
  lines of code.
* **Flexible LLM Adapters** - Provided adapter for `ChatGPT`. More coming soon.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.
* **ChatGPT System Messages** - Instruct ChatGPT to "act as" a specific persona, give it more context,
  and get more personalized responses to all your prompts.
* **Streaming Responses** - The response will be streamed to the UI for a more natural conversation flow.

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/nlux` is the Vanilla JS version of NLUX.
If you're looking for the React JS version, please check out
the [`@nlux/nlux-react`](https://www.npmjs.com/package/@nlux/nlux-react) package.

## Get Started With NLUX and ChatGPT 🚀

To get started with NLUX JS and ChatGPT, install the `@nlux/nlux` and `@nlux/openai` packages:

```sh
npm install @nlux/nlux @nlux/openai
```

Configure the OpenAI adapter with your API key:<br />
_(You can [get an API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) from your
OpenAI dashboard)_

```js
import {createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';

const chatGptAdapter = createAdapter('openai/gpt')
    .withApiKey('YOUR_OPEN_AI_API_KEY')
    // 👇 Instruct ChatGPT how to behave (optional)
    .withInitialSystemMessage(
        'Act as a Nobel Prize in Physics winner who is ' +
        'helping a PHD student in their research'
    );
```

Then render the **Nlux UI component** `Convo Pit` into your web page:

```js
const convoPit = createConvoPit()
    .withAdapter(chatGptAdapter)
    .withPromptBoxOptions({placeholder: 'Ask me anything about nuclear physics!'});

convoPit.mount(document.getElementById('chatroom-div'));
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page.

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Kensington Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.1.9-beta/kensington.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.
