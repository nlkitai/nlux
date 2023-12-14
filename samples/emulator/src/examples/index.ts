import {highlighter} from '@nlux/highlighter';
import {createAiChat, AiChat} from '@nlux/core';
import {createAdapter} from '@nlux/openai';
import {myCustomPromiseAdapter, myCustomStreamingAdapter} from './customAdapter';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

let aiChat: AiChat | null = null;
let rootElement: HTMLElement | null = null;

(window as any).demo = {
    mount: () => rootElement && aiChat?.mount(rootElement),
    unmount: () => aiChat?.unmount(),
    show: () => aiChat?.show(),
    hide: () => aiChat?.hide(),
};

document.addEventListener('DOMContentLoaded', () => {
    rootElement = document.getElementById('nluxc-root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const adapter = createAdapter()
        .withApiKey(apiKey)
        // .withModel('gpt-4')
        .withDataTransferMode('stream')
        .withSystemMessage(
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research',
        );

    aiChat = createAiChat()
        .withAdapter(adapter)
        // .withAdapter(myCustomStreamingAdapter)
        // .withAdapter(myCustomPromiseAdapter)
        .withSyntaxHighlighter(highlighter)
        .withLayoutOptions({
            maxWidth: 500,
            maxHeight: 500,
        })
        .withPromptBoxOptions({
            placeholder: 'Ask me anything about nuclear physics!',
            autoFocus: true,
        });

    aiChat.mount(rootElement);
});
