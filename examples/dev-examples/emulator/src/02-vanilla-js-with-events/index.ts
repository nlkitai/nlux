import {AiChat, createAiChat, ErrorCallback, ErrorEventDetails, MessageReceivedEventDetails} from '@nlux/core';
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
    rootElement = document.getElementById('nlux-AiChat-root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const errorCallback: ErrorCallback = ({errorId, message}: ErrorEventDetails) => {
        console.error(`Error (${errorId}) : ${message}`);
    };

    aiChat = createAiChat()
        .withAdapter(streamAdapter)
        .withMessageOptions({
            syntaxHighlighter: highlighter,
        })
        .withDisplayOptions({
            width: 500,
            height: 500,
        })
        .withComposerOptions({
            placeholder: 'How can I help you today?',
            autoFocus: true,
        })
        .on('error', errorCallback)
        .on('messageReceived',
            ({message}: MessageReceivedEventDetails<string>) => console.log('Message Received:', message),
        );

    aiChat.mount(rootElement);
});
