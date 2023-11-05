# NLUX

[![npm version](https://badge.fury.io/js/@nlux%2Fnlux.svg)](https://badge.fury.io/js/@nlux%2Fnlux)
[![GitHub license](https://img.shields.io/badge/license-MPL%822.0-blue.svg)](https://raw.githubusercontent.com/nlux/nlux-js/master/LICENSE)

## The JS / React Library For Building ChatGPT Conversational UI ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build Custom ChatGPT Interfaces In Minutes** - Easily build chatbot and conversational interfaces with just a few
  lines of code.
* **React Components & Hooks** - `<ConvoPit />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - Provided adapter for `ChatGPT`. More coming soon.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

**And Also ✨**

* **ChatGPT System Messages** - Instruct ChatGPT to "act as" a specific persona, give it more context,
  and get more personalized responses to all your prompts.
* **Streaming Responses** - The response will be streamed to the UI for a more natural conversation flow.

## Repo Content 📦

This Github repository contains the source code for the NLUX library.<br />
It is a monorepo that contains the following NPM packages:

* [`@nlux/nlux`](https://www.npmjs.com/package/@nlux/nlux) - The NLUX Vanilla JS library.
* [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) - An adapter for the OpenAI API.
* [`@nlux/nlux-react`](https://www.npmjs.com/package/@nlux/nlux-react) - React JS components for NLUX.
* [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) - React hooks for the OpenAI API.
* [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) - Themes and CSS styles for NLUX.

Please visit each package's NPM page for information on how to use it.

## Get Started With NLUX JS 🟨

To get started with NLUX JS, install the `@nlux/nlux` and `@nlux/openai` packages:

```sh
npm install @nlux/nlux @nlux/openai
```

Configure the OpenAI adapter with your API key:<br />
_(You can [get an API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) from your
OpenAI dashboard)_

```js
import {createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';

const gpt4Adapter = createAdapter('openai/gpt')
    .withApiKey('YOUR_OPEN_AI_API_KEY');
```

Then render the **NLUX UI component** `Convo Pit` into your web page:

```js
const convoPit = createConvoPit()
    .withAdapter(gpt4Adapter)
    .withPromptBoxOptions({
        placeholder: 'Ask me anything about nuclear physics!'
    })
    // 👇 Instruct ChatGPT how to behave (optional)
    .withInitialSystemMessage(
        'Act as a Nobel Prize in Physics winner who is helping a PHD student in their research'
    );

convoPit.mount(document.getElementById('chatroom-div'));
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page.

## Get Started With NLUX React ⚛️

Install and import dependencies:

```sh
npm install @nlux/nlux-react @nlux/openai-react
```

Then include `<ConvoPit />` in your React app to get started.<br />
Use the `useAdapter` hook to configure an adapter for your LLM.

```jsx
import {ConvoPit} from '@nlux/nlux-react';
import {useAdapter} from '@nlux/openai-react';

const MyChatComp = () => {
    const gpt4Adapter = useAdapter('openai/gpt', {
        apiKey: 'YOUR_OPEN_AI_API_KEY',
        // 👇 Instruct ChatGPT how to behave (optional)
        initialSystemMessage:
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research'
    });

    return (
        <ConvoPit
            adapter={gpt4Adapter}
            promptPlaceholder={'Ask me anything about nuclear physics!'}
        />
    );
}
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page
or import it in your React app.

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Kensington Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.2.6-beta/kensington.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.

In the context of React JS, you can directly `import '@nlux/themes/kensington.css'`
in your app/component, but please make sure that your bundler is configured to handle CSS files.

## Design principles ⚜️

The following design principles guide the development of NLUX:

* **Natural**: The library should be as natural as possible. It should be easy to
  use and understand. The user experience should be intuitive and pleasant.
  No teaching or thinking should be required to use the library.

* **Fast**: The library should be as fast as possible. It should be fast to
  load, fast to render, fast to update, fast to respond to user input.
  To achieve that, we should avoid unnecessary work, optimize the code for performance,
  prefer native implementations where possible, and minimize bundle size.

* **Modular**: The library should be built with modularity and reusability in mind.
  We should break the UI into separate reusable components that can be combined to
  build various applications. This allows for more flexibility and customization.

* **Lightweight**: The library should be as lightweight as possible. It should
  not require any dependencies, language features, special build tools.

* **Accessible** - The library should be accessible to everyone. It should be
  usable by people with disabilities, on various devices, and in various
  environments.

## License 📃

NLUX is licensed under the terms of the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).<br />
Wondering what that means? Learn more on [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

## Mission 👨‍🚀

Our mission is **to enable developers to build outstanding LLM front-ends and apps**,
cross platforms, with a focus on performance and usability.

## Community and Support 🙏

* **Star The Repo** 🌟 - If you like NLUX, please star the repo to show your support.
* **[Github Discussions](https://github.com/nluxai/nlux/discussions)** - Ask questions, share ideas, and get help from
  the community.

## About The Developer 👨‍💻

NLUX is an open-source project that's being led by [Salmen Hichri](https://github.com/salmenus), a senior front-end
engineer based in London, with over a decade of experience building user interfaces and developer
tools at companies like Amazon and Goldman Sachs, and contributions to open-source projects.
