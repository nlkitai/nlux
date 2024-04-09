import './style.css';
import '@nlux-dev/themes/src/luna/theme.css';
import {createAiChat} from '@nlux-dev/core/src';
import {createChatAdapter} from '@nlux-dev/nlbridge/src';

document.addEventListener('DOMContentLoaded', () => {
    const parent = document.getElementById('aiChat-parent')!;
    const adapter = createChatAdapter().withUrl('http://localhost:8899/');
    const aiChat = createAiChat().withAdapter(adapter);
    aiChat.mount(parent);
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>AiChat Vanilla TS</h1>
    <div id="aiChat-parent">
    </div>
  </div>
`;
