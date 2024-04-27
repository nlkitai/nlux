import './style.css';
import '@nlux-dev/themes/src/luna/theme.css';
import '@nlux-dev/highlighter/src/themes/stackoverflow/dark.css';
import {createAiChat} from '@nlux-dev/core/src';
import {highlighter} from '@nlux-dev/highlighter/src';
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
            autoScroll: true,
        })
        .withLayoutOptions({
            width: 400,
            height: 300,
        });

    aiChat.mount(parent);

    aiChat.updateProps({
        syntaxHighlighter: highlighter,
    });
});
