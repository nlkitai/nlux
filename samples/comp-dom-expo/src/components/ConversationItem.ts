import '../style.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import '@nlux-dev/themes/src/naked/components/ConversationItem.css';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import {createConvItemDom} from '@nlux-dev/core/src/comp/ConvItem/create.ts';
import {ConvItemProps} from '@nlux-dev/core/src/comp/ConvItem/props.ts';
import {updateConvItemDom} from '@nlux-dev/core/src/comp/ConvItem/update.ts';
import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>ConversationItem Comp</h3>
        <div class="ConversationItem-expo">
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
                <input type="text" placeholder="ConversationItem" />
            </div>
            <div class="content">
                <!-- ConversationItem component will be rendered here -->
            </div>
        </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.ConversationItemComp-expo')!;
    let props: ConvItemProps = {
        direction: 'incoming',
        status: 'rendered',
        message: 'Hello, World!',
        name: 'Alex Doe',
        picture: 'https://nlux.ai/images/demos/persona-user.jpeg',
    };

    const conversationItem = createConvItemDom(props);

    const directionSelector = container.querySelector<HTMLSelectElement>('.controls select.direction')!;
    directionSelector.addEventListener('change', () => {
        const direction = directionSelector.value as MessageDirection;
        const newProps: ConvItemProps = {
            ...props,
            direction,
        };

        updateConvItemDom(conversationItem, props, newProps);
        props = newProps;
    });

    const statusSelector = container.querySelector<HTMLSelectElement>('.controls select.status')!;
    statusSelector.addEventListener('change', () => {
        const status = statusSelector.value as MessageStatus;
        const newProps: ConvItemProps = {
            ...props,
            status,
        };

        updateConvItemDom(conversationItem, props, newProps);
        props = newProps;
    });

    const messageInput = container.querySelector<HTMLInputElement>('.controls input')!;
    messageInput.value = props.message ?? '';
    messageInput.addEventListener('input', () => {
        const newProps: ConvItemProps = {
            ...props,
            message: messageInput.value,
        };

        updateConvItemDom(conversationItem, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(conversationItem);
});
