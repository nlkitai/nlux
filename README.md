# NLUX

<p align=center style="font-size: 1.5em">
  <img style="padding: 0; margin: 0;" height="80px" src="https://content.nlkit.com/logos/nlux.png"/><br />
  The <strong>Powerful</strong> Conversational AI<br />JavaScript Library ✨💬
</p>
<p align=center>
  <img alt="Free & Open Source" src="https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61" />
  <a href="https://github.com/nlkitai/nlux/actions/workflows/run-all-tests.yml"><img alt="600+ Unit Tests" src="https://github.com/nlkitai/nlux/actions/workflows/run-all-tests.yml/badge.svg" /></a>
<br />
  <a href="https://www.npmjs.com/package/@nlux/react"><img alt="npm @nlux/react" src="https://img.shields.io/badge/NPM-@nlux/react-dbda6a" /></a>
  <a href="https://www.npmjs.com/package/@nlux/core"><img alt="npm @nlux/core" src="https://img.shields.io/badge/NPM-@nlux/core-dbda6a" /></a>
</p>
<p align="center">
    <a href="https://docs.nlkit.com/nlux">Docs Website</a> | <a href="https://discord.gg/SRwDmZghNB">Discord Community</a> | <a href="https://twitter.com/nluxai">X</a>
</p>
<p align="center">
    Do you like this project ? Please star the repo to show your support 🌟 🧡
    <br />
    Building with <code>NLUX</code> ? <a href="https://calendly.com/nlkit/intro">Get in touch</a> — We'd love to hear from you.
</p>

------

`NLUX` is React and JavaScript open-source library for building conversational AI interfaces. It makes it super simple
to build web applications powered by Large Language Models (LLMs). With just a few  lines of code, you can add
conversational AI capabilities and interact with your favorite AI models.

## Try `NLUX` 🚀

Use `nlux-cli` to quickly spin up a new `Next.js`, `React`, or `Vanilla TypeScript` project with NLUX integrated.

[![NLUX UI For Any LLM](https://content.nlkit.com/images/github/nlux-cli-animation.gif)](https://docs.nlkit.com/nlux)

**Get started with `NLUX` and your favorite web framework under a minute:**

```sh
# Next.js 🔼 with NLUX 
npx nlux-cli create next my-next-app
```
```sh
# React ⚛️ , Vite, with NLUX
npx nlux-cli create react my-react-app
```
```sh
# Or, vanilla TypeScript 🟨 , Vite, with NLUX
npx nlux-cli create vanilla my-vanilla-app
```

## Developing this repository

Use Node **24.21.0** and Yarn **1.22.22**. From a fresh checkout:

```sh
yarn install --frozen-lockfile
yarn set
yarn dev
```

Open **http://127.0.0.1:9090** for a local streaming chat demo that needs no API key.
Run `yarn lint`, `yarn build`, `yarn test`, and `yarn build-demo` to verify changes.
See [the pipeline guide](pipeline/README.md) for runtime setup, watch mode, and cleanup.

## Docs & Examples 🔥

* The docs website is available at:  
  **[docs.nlkit.com/nlux](https://docs.nlkit.com/nlux)**

* Several **Get Started Guides** are available, including for:  
  [Next.js and Vercel AI](https://docs.nlkit.com/nlux/learn/get-started/vercel-ai/) —
  [LangChain LangServe](https://docs.nlkit.com/nlux/learn/get-started/nlux-langchain) —
  [React with Node.js Backend](https://docs.nlkit.com/nlux/learn/get-started/nlux-nodejs-nlbridge-chatgpt)

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useChatAdapter` hook for easy integration.
* **Next.js & Vercel AI** ― Out-of-the-box support, demos, and examples for Next.js and Vercel AI.
* **React Server Components (RSC) and Generative UI** 🔥 ― With Next.js or any RSC compatible framework.
* **LLM Adapters** ― For `ChatGPT` ― `LangChain` 🦜 `LangServe` APIs ― `Hugging Face` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** 🎯 for any LLM ― with support for stream or batch modes.
* **Assistant and User Personas** ― Customize participant personas with names, images, and descriptions.
* **Highly Customizable** ― Tune almost every UI aspect through theming, layout options, and more.
* **Zero Dependency** ― Lightweight codebase ― Core with zero dependency and no external UI libraries.

## Repo Content 📦

This GitHub repository contains the source code for the `NLUX` library.<br />
It is a monorepo that contains code for following NPM packages:

⚛️ **React JS Packages:**

* [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) ― React JS components for `NLUX`.
* [`@nlux/langchain-react`](https://www.npmjs.com/package/@nlux/langchain-react) ― React hooks and adapter for APIs
  created using LangChain's LangServe library.
* [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) ― React hooks for the OpenAI API, for testing
  and development.
* [`@nlux/hf-react`](https://www.npmjs.com/package/@nlux/hf-react) ― React hooks and pre-processors for the Hugging Face
  Inference API
* [`@nlux/nlbridge-react`](https://www.npmjs.com/package/@nlux/nlbridge-react) ― Integration with `nlbridge`, the
  Express.js LLM middleware by the NLUX team.

🟨 **Vanilla JS Packages:**

* [`@nlux/core`](https://www.npmjs.com/package/@nlux/core) ― The core Vanilla JS library to use with any web framework.
* [`@nlux/langchain`](https://www.npmjs.com/package/@nlux/langchain) ― Adapter for APIs created using LangChain's
  LangServe library.
* [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) ― Adapter for the OpenAI API, for testing and
  development.
* [`@nlux/hf`](https://www.npmjs.com/package/@nlux/hf) ― Adapter and pre-processors for the Hugging Face Inference API.
* [`@nlux/nlbridge`](https://www.npmjs.com/package/@nlux/nlbridge) ― Integration with `nlbridge`, the Express.js LLM
  middleware by the NLUX team.

🎁 **Themes & Extensions:**

* [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) ― The default `Luna` theme and CSS styles.
* [`@nlux/markdown`](https://www.npmjs.com/package/@nlux/markdown) ― Markdown stream parser to render
  markdown as it's being generated.
* [`@nlux/highlighter`](https://www.npmjs.com/package/@nlux/highlighter) ― Syntax highlighter based on
  [Highlight.js](https://highlightjs.org/).

Please visit each package's NPM page for information on how to use it.

## Design Principles ⚜️

The following design principles guide the development of `NLUX`:

* **Intuitive** ― Interactions enabled by `NLUX` should be intuitive.
  Usage should unfold naturally without obstacles or friction. No teaching or thinking
  should be required to use UI built with `NLUX`.

* **Performant** ― `NLUX` should be as fast as possible. Fast to load, fast to render
  and update, fast to respond to user input. To achieve that, we should avoid unnecessary
  work, optimize for performance, minimize bundle size, and not depend on external libraries.

* **Accessible** ― UI built with `NLUX` should be accessible to everyone. It should be usable
  by people with disabilities, on various devices, in various environments, and using various
  input methods (keyboard, touch, voice).

* **DX** ― `NLUX` recognizes developers as first-class citizens. The library should enable an
  optimal DX (developer experience). It should be effortless to use, easy to understand, and
  simple to extend. Stellar documentation should be provided. The feature roadmap should evolve
  aligning to developer needs voiced.

## Mission 👨‍🚀

Our mission is **to enable developers to build outstanding LLM front-ends and applications**,
cross platforms, with a focus on performance and usability.

## Community & Support 🙏

* **Star The Repo** 🌟 ― If you like `NLUX`, please star the repo to show your support.  
  Your support is what keeps this open-source project going 🧡
* [GitHub Discussions](https://github.com/nlkitai/nlux/discussions) ― Ask questions, report issues, and share your
  ideas with the community.
* [Discord Community](https://discord.gg/SRwDmZghNB) ― Join our Discord server to chat with the community and get
  support.
* [docs.nlkit.com/nlux](https://docs.nlkit.com/nlux) Developer Website ― Examples, learning resources, and API reference.

## License 📃

`NLUX` is licensed under Mozilla Public License Version 2.0 with restriction to use as
part of a training dataset to develop or improve AI models, or as an input for code
translation tools.

> Paragraphs (3.6) and (3.7) were added to the original MPL 2.0 license.  
> The full license text can be found in the [LICENSE](LICENSE) file.

**In a nutshell:**

* You can use `NLUX` in your personal projects.
* You can use `NLUX` in your commercial projects.
* You can modify `NLUX` and publish your changes under the same license.
* You cannot use `NLUX`'s source code as dataset to train AI models, nor with code translation tools.

Wondering what it means to use software licensed under MPL 2.0? Learn more
on [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).  
Please read the full license text in the [LICENSE](LICENSE) file for details.

## About The Project 👨‍💻

This open-source project fits under the umbrella of [NLKit](https://nlkit.com), a suite of tools and libraries for 
building conversational AI applications. `NLUX` is the first project in the NLKit suite, with more to come.

The project is being led by [Salmen Hichri](https://github.com/salmenus), a senior software engineer with over a decade of experience building user interfaces and developer
tools at companies like Amazon and Goldman Sachs, and contributions to open-source projects.
