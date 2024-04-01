# Markdown Stream Parser by [nlux](https://nlux.ai) 🌲✨💬

[![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342)](https://github.com/nluxai/nlux) [![Docs nlux.ai](https://img.shields.io/badge/Docs_Website-nlux.dev-%23fa896b)](https://nlux.dev)

A lightweight JS/TS library that can be used to parse markdown streams as they are being read or generated.  
It can be useful for LLM-powered applications that need to parse markdown streams in real-time.

This package is part of the [nlux](https://nlux.ai) ecosystem.

## Usage

```ts
import {
    MarkdownStreamParser,
    MarkdownStreamParserOptions,
    createMarkdownStreamParser,
} from "@nlux/markdown";

const options: MarkdownStreamParserOptions = {
    // skipAnimation: <true / false >,  // default: false
    // syntaxHighlighter: < Highlighter from @nlux/highlighter >
    // onComplete: () => console.log("Parsing complete"),
};

const domElement = document.querySelector(".markdown-container");
const mdStreamParser: MarkdownStreamParser = createMarkdownStreamParser(
    domElement!,
    options,
);

// On each chunk of markdown
mdStreamParser.next("## Hello World");

// When the markdown stream is complete
mdStreamParser.complete();
```

## Interfaces

```ts
export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};

export type MarkdownStreamParserOptions = {
    linksOpenInNewWindow?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    skipAnimation?: boolean;
    onComplete?(completeCallback: Function): void;
};
```