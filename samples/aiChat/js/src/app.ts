import './style.css';
import '@nlux-dev/themes/src/luna/theme.css';
import {createAiChat} from '@nlux-dev/core/src';
import {createChatAdapter} from '@nlux-dev/nlbridge/src';
import {createUnsafeChatAdapter} from '@nlux-dev/openai/src';

document.addEventListener('DOMContentLoaded', () => {
    const parent = document.getElementById('root')!;

    const adapter = createChatAdapter()
        .withUrl('http://localhost:8899/');
    const openAiAdapter = createUnsafeChatAdapter()
        .withApiKey('sk_1234567890')
        .withDataTransferMode('fetch');

    const aiChat = createAiChat()
        .withAdapter(openAiAdapter)
        .withPromptBoxOptions({
            placeholder: 'Type your prompt here',
            autoFocus: true,
            // submitShortcut: 'CommandEnter',
        })
        .withConversationOptions({
            autoScroll: false,
        })
        .withLayoutOptions({
            width: 400,
            height: 300,
        });

    aiChat.mount(parent);
});

