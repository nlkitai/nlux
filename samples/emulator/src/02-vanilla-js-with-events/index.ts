import {AiChat, createAiChat, ErrorCallback, ErrorEventDetails} from '@nlux/core';
import {highlighter} from '@nlux/highlighter';
import {streamAdapter} from './stream';

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

    const errorCallback: ErrorCallback = ({errorId, message}: ErrorEventDetails) => {
        console.error(`Error (${errorId}) : ${message}`);
    };

    aiChat = createAiChat()
        .withAdapter(streamAdapter)
        .withSyntaxHighlighter(highlighter)
        .withLayoutOptions({
            maxWidth: 500,
            maxHeight: 500,
        })
        .withPromptBoxOptions({
            placeholder: 'How can I help you today?',
            autoFocus: true,
        })
        .on('error', errorCallback)
        .on('messageReceived', (message: string) => console.log('Message Received:', message));

    aiChat.mount(rootElement);
});
