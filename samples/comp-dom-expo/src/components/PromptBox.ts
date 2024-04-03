import '../style.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import '@nlux-dev/themes/src/naked/components/PromptBox.css';
import {createPromptBoxDom} from '@nlux-dev/core/src/comp/PromptBox/create.ts';
import {PromptBoxProps, PromptBoxStatus} from '@nlux-dev/core/src/comp/PromptBox/props.ts';
import {updatePromptBoxDom} from '@nlux-dev/core/src/comp/PromptBox/update.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
<div class="nlux_root expo-container">
    <h3>PromptBox Comp</h3>
    <div class="PromptBox-expo">
        <div class="controls">
            <input class="placeholder" type="text" placeholder="Placeholder" />
            <input class="message" type="text" placeholder="Message" />
            <select class="status">
                <option value="typing">Typing</option>
                <option value="waiting">Waiting</option>
                <option value="submitting">Submitting</option>
            </select>
        </div>
        <div class="content">
            <!-- Message component will be rendered here -->
        </div>
    </div>
</div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.PromptBox-expo')!;
    let props: PromptBoxProps = {
        status: 'typing',
        placeholder: 'Type your message here',
        message: 'Hello, World!',
    };

    const placeholderInput = container.querySelector<HTMLInputElement>('.controls .placeholder')!;
    const messageInput = container.querySelector<HTMLInputElement>('.controls .message')!;
    const statusSelector = container.querySelector<HTMLSelectElement>('.controls .status')!;

    placeholderInput.value = props.placeholder ?? '';
    messageInput.value = props.message ?? '';
    statusSelector.value = props.status;

    placeholderInput.addEventListener('input', () => {
        const propsAfter = {
            ...props,
            placeholder: placeholderInput.value,
        };

        updatePromptBoxDom(promptBox, props, propsAfter);
        props = propsAfter;
    });

    messageInput.addEventListener('input', () => {
        const propsAfter = {
            ...props,
            message: messageInput.value,
        };

        updatePromptBoxDom(promptBox, props, propsAfter);
        props = propsAfter;
    });

    statusSelector.addEventListener('change', () => {
        const propsAfter = {
            ...props,
            status: statusSelector.value as PromptBoxStatus,
        };

        updatePromptBoxDom(promptBox, props, propsAfter);
        props = propsAfter;
    });

    const promptBox = createPromptBoxDom(props);
    container.querySelector<HTMLDivElement>('.content')!.append(promptBox);
});
