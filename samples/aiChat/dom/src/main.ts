import './style.css';
import {createAiChat} from '@nlux/core';
import {createChatAdapter} from '@nlux/nlbridge';
import '@nlux/themes/luna.css';

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
