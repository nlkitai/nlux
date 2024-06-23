import '../style.css';
import '@nlux-dev/themes/src/luna/main.css';
import {createComposerDom} from '@shared/components/Composer/create';
import {ComposerProps, ComposerStatus} from '@shared/components/Composer/props';
import {updateComposerDom} from '@shared/components/Composer/update';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
<div class="nlux_root expo-container">
    <h3>Composer Comp</h3>
    <div class="Composer-expo">
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
    const container = document.querySelector<HTMLDivElement>('.Composer-expo')!;
    let props: ComposerProps = {
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

        updateComposerDom(composer, props, propsAfter);
        props = propsAfter;
    });

    messageInput.addEventListener('input', () => {
        const propsAfter = {
            ...props,
            message: messageInput.value,
        };

        updateComposerDom(composer, props, propsAfter);
        props = propsAfter;
    });

    statusSelector.addEventListener('change', () => {
        const propsAfter = {
            ...props,
            status: statusSelector.value as ComposerStatus,
        };

        updateComposerDom(composer, props, propsAfter);
        props = propsAfter;
    });

    const composer = createComposerDom(props);
    container.querySelector<HTMLDivElement>('.content')!.append(composer);
});
