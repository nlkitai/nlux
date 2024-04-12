import './style.css';
import '@nlux-dev/themes/src/luna/theme.css';
import {createAiChat} from '@nlux-dev/core/src';
import {createChatAdapter} from '@nlux-dev/nlbridge/src';

document.addEventListener('DOMContentLoaded', () => {
    const parent = document.getElementById('root')!;
    const adapter = createChatAdapter().withUrl('http://localhost:8899/');
    const aiChat = createAiChat()
        .withAdapter(adapter)
        .withPromptBoxOptions({
            placeholder: 'Type your prompt here',
            autoFocus: true,
        });

    aiChat.mount(parent);
});

