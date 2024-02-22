# nlux

<p align=center>
  <img style="padding: 0; margin: 0;" height="80px" src="https://nlux.dev/nlux-logo/nlux-logo-main.png"/><br />
  The React JS and Javascript Library For Building Conversational AI Interfaces ✨💬
</p>
<p align=center>
  <img alt="Free & Open Source" src="https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61" />
  <a href="https://www.npmjs.com/package/@nlux/react"><img alt="npm @nlux/react" src="https://img.shields.io/badge/NPM-@nlux/react-1ccb61" /></a>
  <a href="https://www.npmjs.com/package/@nlux/core"><img alt="npm @nlux/core" src="https://img.shields.io/badge/NPM-@nlux/core-1ccb61" /></a>
</p>
<p align="center">
    <a href="https://nlux.dev">Docs Website</a> | <a href="https://discord.gg/SRwDmZghNB">Discord Community</a> | <a href="https://twitter.com/nluxai">X</a>
</p>
<p align="center">
    Love the project ? Please star the repo to show your support 🌟 🧡
    <br />
    Building with nlux ? <a href="https://calendar.app.google/6t54aKt6fPVHtcXC9">Get in touch</a> - we'd love to hear from you.
</p>

------

`nlux` (_for Natural Language User Experience_) is an open-source Javascript and React JS library that makes it super
simple to integrate powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few
lines of code, you can add conversational AI capabilities and interact with your favourite LLM.

[![nlux UI For Any LLM](https://nlux.ai/images/github/nlux-ui-for-llms-banner.gif)](https://nlux.dev)

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **LLM Adapters** ― For `ChatGPT` ― `LangChain` 🦜 `LangServe` APIs ― `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** 🎯 for any LLM ― with support for stream or fetch modes.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and descriptions.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Highly Customizable** ― Tune almost every UI aspect through theming, layout options, and more.
* **Zero Dependencies** ― Lightweight codebase ― Core with zero dependency and no external UI libraries.

[![200+ Unit Tests](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml/badge.svg)](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml)

## Repo Content 📦

This GitHub repository contains the source code for the `nlux` library.<br />
It is a monorepo that contains code for following NPM packages:

**React JS Packages:**

* [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) ― React JS components for `nlux`.
* [`@nlux/langchain-react`](https://www.npmjs.com/package/@nlux/langchain-react) ― React hooks and adapter for APIs
  created using LangChain's LangServe library.
* [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) ― React hooks for the OpenAI API, for testing
  and development.
* [`@nlux/hf-react`](https://www.npmjs.com/package/@nlux/hf-react) ― React hooks and pre-processors for the Hugging Face
  Inference API
* [`@nlux/nlbridge-react`](https://www.npmjs.com/package/@nlux/nlbridge-react) ― Integration with `nlbridge`, the
  Express.js LLM middleware by the nlux team.

**Vanilla JS Packages:**

* [`@nlux/core`](https://www.npmjs.com/package/@nlux/core) ― The core Vanilla JS library to use with any web framework.
* [`@nlux/langchain`](https://www.npmjs.com/package/@nlux/langchain) ― Adapter for APIs created using LangChain's
  LangServe library.
* [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) ― Adapter for the OpenAI API, for testing and
  development.
* [`@nlux/hf`](https://www.npmjs.com/package/@nlux/hf) ― Adapter and pre-processors for the Hugging Face Inference API.
* [`@nlux/nlbridge`](https://www.npmjs.com/package/@nlux/nlbridge) ― Integration with `nlbridge`, the Express.js LLM
  middleware by the nlux team.

**Theme & Extensions:**

* [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) ― The default `Nova` theme and CSS styles.
* [`@nlux/markdown`](https://www.npmjs.com/package/@nlux/markdown) ― Markdown stream parser to render
  markdown as it's being generated.
* [`@nlux/highlighter`](https://www.npmjs.com/package/@nlux/highlighter) ― Syntax highlighter based on
  [Highlight.js](https://highlightjs.org/).

Please visit each package's NPM page for information on how to use it.

## Docs & Examples 🤩

* For developer documentation, examples, and API reference ― please visit:  
  [nlux.dev](https://nlux.dev/)

## Design Principles ⚜️

The following design principles guide the development of `nlux`:

* **Intuitive** ― Interactions enabled by `nlux` should be intuitive.
  Usage should unfold naturally without obstacles or friction. No teaching or thinking
  should be required to use UI built with `nlux`.

* **Performance** ― `nlux` should be as fast as possible. Fast to load, fast to render
  and update, fast to respond to user input. To achieve that, we should avoid unnecessary
  work, optimize for performance, minimize bundle size, and not depend on external libraries.

* **Accessibility** ― UI built with `nlux` should be accessible to everyone. It should be usable
  by people with disabilities, on various devices, in various environments, and using various
  input methods (keyboard, touch, voice).

* **DX** ― `nlux` recognizes developers as first-class citizens. The library should enable an
  optimal DX (developer experience). It should be effortless to use, easy to understand, and
  simple to extend. Stellar documentation should be provided. The feature roadmap should evolve
  aligning to developer needs voiced.

## Mission 👨‍🚀

Our mission is **to enable developers to build outstanding LLM front-ends and applications**,
cross platforms, with a focus on performance and usability.

## Community & Support 🙏

* **Star The Repo** 🌟 ― If you like `nlux`, please star the repo to show your support.  
  Your support is what keeps this open-source project going 🧡
* [GitHub Discussions](https://github.com/nluxai/nlux/discussions) ― Ask questions, report issues, and share your
  ideas with the community.
* [Discord Community](https://discord.gg/SRwDmZghNB) ― Join our Discord server to chat with the community and get
  support.
* [nlux.dev](https://nlux.dev/) Developer Website ― Examples, learning resources, and API reference.

## License 📃

`nlux` is licensed under the terms of the Mozilla Public License 2.0.<br />
Wondering what that means? Learn more on [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

## About The Developer 👨‍💻

`nlux` is a new open-source project that's being led by [Salmen Hichri](https://github.com/salmenus), a senior front-end
engineer with over a decade of experience building user interfaces and developer
tools at companies like Amazon and Goldman Sachs, and contributions to open-source projects.
