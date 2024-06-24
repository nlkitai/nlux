## Demo — NLUX with Next.js App Router

This is a demo project that shows how to use [NLUX](https://docs.nlkit.com/nlux) with [Next.js](https://nextjs.org/)
app router to stream text data from the server to the client.

## Run The Demo

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.<br />
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Code Overview

The main files in this demo are the following:

* `src/app/page.tsx` - The main page with `<AiChat />` component and adapter.
* `src/app/stream.ts` - A simple function to submit a prompt and stream the response back.
* `src/app/api/chat/route.ts` - API route to handle the chat requests.

## Learn More

To learn more about NLUX, take a look at the following resources:

- [Documentation](https://docs.nlkit.com/nlux) - Learn about Next.js features and API.
- [Examples](https://docs.nlkit.com/examples) - Find more examples of using NLUX with different setups.

You can check out [the NLUX GitHub repository](https://github.com/nlkitai/nlux/) - your feedback and contributions are welcome.
