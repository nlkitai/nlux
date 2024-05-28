import '../style.css';
import '@nlux-dev/themes/src/luna/main.css';
import {createWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/create';
import {WelcomeMessageProps} from '../../../../../packages/shared/src/ui/WelcomeMessage/props';
import {updateWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/update';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>WelcomeMessage Comp</h3>
        <div class="WelcomeMessage-expo">
            <div class="controls">
                <input type="text" placeholder="WelcomeMessage" class="message" />
                <input type="text" placeholder="Name" class="name" />
                <input type="text" placeholder="Avatar" class="avatar" />
            </div>
            <div class="content">
                <!-- WelcomeMessage component will be rendered here -->
            </div>
        </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.WelcomeMessage-expo')!;
    let props: WelcomeMessageProps = {
        message: 'Hello, World!',
        name: 'Alex Doe',
        avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png',
    };

    const welcomeMessage = createWelcomeMessageDom(props);

    const messageInput = container.querySelector<HTMLInputElement>('.controls input.message')!;
    messageInput.value = props.message ?? '';
    messageInput.addEventListener('input', () => {
        const newProps: WelcomeMessageProps = {
            ...props,
            message: messageInput.value,
        };

        updateWelcomeMessageDom(welcomeMessage, props, newProps);
        props = newProps;
    });

    const nameInput = container.querySelector<HTMLInputElement>('.controls input.name')!;
    nameInput.value = props.name ?? '';
    nameInput.addEventListener('input', () => {
        const newProps: WelcomeMessageProps = {
            ...props,
            name: nameInput.value,
        };

        updateWelcomeMessageDom(welcomeMessage, props, newProps);
        props = newProps;
    });

    const avatarInput = container.querySelector<HTMLInputElement>('.controls input.avatar')!;
    avatarInput.value = typeof props.avatar === 'string' ? props.avatar : '';
    avatarInput.addEventListener('input', () => {
        const newProps: WelcomeMessageProps = {
            ...props,
            avatar: avatarInput.value,
        };

        updateWelcomeMessageDom(welcomeMessage, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(welcomeMessage);
});
