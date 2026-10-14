import {createAiChat} from '@nlux/core';
import type {ChatAdapter} from '@nlux/core';
import '@nlux/themes/nova.css';
import './style.css';

const adapter: ChatAdapter = {
    streamText(_message, observer, extras) {
        const previousReplies = extras.conversationHistory?.filter(item => item.role === 'assistant').length ?? 0;
        const chunks = [
            `This is local mock reply **${previousReplies + 1}**.\n\n`,
            'Your message reached the adapter, ',
            'and this response is streaming back into NLUX.\n\n',
            'Try another message to check conversation history.',
        ];
        let index = 0;
        const timer = setInterval(() => {
            observer.next(chunks[index++]);
            if (index === chunks.length) {
                clearInterval(timer);
                observer.complete();
            }
        }, 150);
    },
};

const chat = createAiChat()
    .withAdapter(adapter)
    .withDisplayOptions({themeId: 'nova', colorScheme: 'light', height: 480})
    .withConversationOptions({historyPayloadSize: 'max'})
    .withComposerOptions({placeholder: 'Send a message to the mock assistant', autoFocus: true});

chat.mount(document.getElementById('chat')!);

if (import.meta.hot) {
    import.meta.hot.dispose(() => chat.unmount());
}
