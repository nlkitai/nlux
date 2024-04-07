import '../style.css';
import {createWelcomeMessageDom} from '@nlux-dev/core/src/ui/WelcomeMessage/create.ts';
import '@nlux-dev/themes/src/naked/components/WelcomeMessage.css';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import {WelcomeMessageProps} from '@nlux-dev/core/src/ui/WelcomeMessage/props.ts';
import {updateWelcomeMessageDom} from '@nlux-dev/core/src/ui/WelcomeMessage/update.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
    <div class="nlux_root expo-container">
        <h3>WelcomeMessage Comp</h3>
        <div class="WelcomeMessage-expo">
            <div class="controls">
                <input type="text" placeholder="WelcomeMessage" class="message" />
                <input type="text" placeholder="Name" class="name" />
                <input type="text" placeholder="Picture" class="picture" />
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
        picture: 'https://nlux.ai/images/demos/persona-user.jpeg',
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

    const pictureInput = container.querySelector<HTMLInputElement>('.controls input.picture')!;
    pictureInput.value = typeof props.picture === 'string' ? props.picture : '';
    pictureInput.addEventListener('input', () => {
        const newProps: WelcomeMessageProps = {
            ...props,
            picture: pictureInput.value,
        };

        updateWelcomeMessageDom(welcomeMessage, props, newProps);
        props = newProps;
    });

    container.querySelector<HTMLDivElement>('.content')!.append(welcomeMessage);
});
