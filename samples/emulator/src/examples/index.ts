import {AiChat, createAiChat} from '@nlux/core';
import {highlighter} from '@nlux/highlighter';
import {createAdapter} from '@nlux/openai';

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
            'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. ' +
            'Only recommend legal, ethical practices. Be friendly. Write concise answers under 5 sentences.',
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
            placeholder: 'How can I help you today?',
            autoFocus: true,
        });

    aiChat.mount(rootElement);
});
