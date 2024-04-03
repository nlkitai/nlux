import '../style.css';
import {createMessageDom} from '@nlux-dev/core/src/comp/Message/create.ts';
import '@nlux-dev/themes/src/naked/components/Message.css';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import {MessageDirection, MessageProps, MessageStatus} from '@nlux-dev/core/src/comp/Message/props.ts';
import {updateMessageDom} from '@nlux-dev/core/src/comp/Message/update.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>Message Comp</h3>
        <div class="Message-expo">
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
                <input type="text" placeholder="Message" />
            </div>
            <div class="content">
                <!-- Message component will be rendered here -->
            </div>
        </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.Message-expo')!;
    let props: MessageProps = {
        direction: 'incoming',
        status: 'rendered',
        message: 'Hello, World!',
    };

    const message = createMessageDom(props);

    const directionSelector = container.querySelector<HTMLSelectElement>('.controls select.direction')!;
    directionSelector.addEventListener('change', () => {
        const direction = directionSelector.value as MessageDirection;
        const newProps: MessageProps = {
            ...props,
            direction,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    const statusSelector = container.querySelector<HTMLSelectElement>('.controls select.status')!;
    statusSelector.addEventListener('change', () => {
        const status = statusSelector.value as MessageStatus;
        const newProps: MessageProps = {
            ...props,
            status,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    const messageInput = container.querySelector<HTMLInputElement>('.controls input')!;
    messageInput.value = props.message ?? '';
    messageInput.addEventListener('input', () => {
        const newProps: MessageProps = {
            ...props,
            message: messageInput.value,
        };

        updateMessageDom(message, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(message);
});
