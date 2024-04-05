import '../style.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import '@nlux-dev/themes/src/naked/components/ChatItem.css';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import {createChatItemDom} from '@nlux-dev/core/src/comp/ChatItem/create.ts';
import {ChatItemProps} from '@nlux-dev/core/src/comp/ChatItem/props.ts';
import {updateChatItemDom} from '@nlux-dev/core/src/comp/ChatItem/update.ts';
import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>ChatItem Comp</h3>
        <div class="ChatItem-expo">
            <div class="controls">
                <select class="direction">
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                </select>
                <select class="status">
                    <option value="rendered">Rendered</option>
                    <option value="loading">Loading</option>
                    <option value="streaming">Streaming</option>
                </select>
                <input type="text" placeholder="ChatItem" />
            </div>
            <div class="content">
                <!-- ChatItem component will be rendered here -->
            </div>
        </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.ChatItemComp-expo')!;
    let props: ChatItemProps = {
        direction: 'incoming',
        status: 'rendered',
        message: 'Hello, World!',
        name: 'Alex Doe',
        picture: 'https://nlux.ai/images/demos/persona-user.jpeg',
    };

    const chatItem = createChatItemDom(props);

    const directionSelector = container.querySelector<HTMLSelectElement>('.controls select.direction')!;
    directionSelector.addEventListener('change', () => {
        const direction = directionSelector.value as MessageDirection;
        const newProps: ChatItemProps = {
            ...props,
            direction,
        };

        updateChatItemDom(chatItem, props, newProps);
        props = newProps;
    });

    const statusSelector = container.querySelector<HTMLSelectElement>('.controls select.status')!;
    statusSelector.addEventListener('change', () => {
        const status = statusSelector.value as MessageStatus;
        const newProps: ChatItemProps = {
            ...props,
            status,
        };

        updateChatItemDom(chatItem, props, newProps);
        props = newProps;
    });

    const messageInput = container.querySelector<HTMLInputElement>('.controls input')!;
    messageInput.value = props.message ?? '';
    messageInput.addEventListener('input', () => {
        const newProps: ChatItemProps = {
            ...props,
            message: messageInput.value,
        };

        updateChatItemDom(chatItem, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(chatItem);
});
