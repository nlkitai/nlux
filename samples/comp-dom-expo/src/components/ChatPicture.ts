import '../style.css';
import '@nlux-dev/themes/src/naked/components/ChatPicture.css';
import {createChatPictureDom} from '@nlux-dev/core/src/comp/ChatPicture/create.ts';
import {ChatPictureProps} from '@nlux-dev/core/src/comp/ChatPicture/props.ts';
import {updateChatPictureDom} from '@nlux-dev/core/src/comp/ChatPicture/update.ts';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
<div class="nlux_root expo-container">
    <h3>ChatPicture Comp</h3>
    <div class="ChatPicture-expo">
        <div class="controls">
            <input type="text" class="name" />
            <input type="text" class="url" />
            <select>
                <option value="url">Insert as URL</option>
                <option value="img">Insert as IMG Tag</option>
            </select>
        </div>
        <div class="content">
            <!-- Message component will be rendered here -->
        </div>
    </div>
</div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

const imgFromProps = (props: ChatPictureProps): HTMLElement => {
    if (typeof props.picture !== 'string') {
        return props.picture as HTMLImageElement;
    }

    const newImg = document.createElement('img');
    newImg.src = props.picture as string;
    newImg.alt = props.name ?? '';
    newImg.style.width = '100px';
    newImg.style.aspectRatio = '1 / 1';
    return newImg;
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.ChatPicture-expo')!;
    let insertAs: 'url' | 'img' = 'url';
    let props: ChatPictureProps = {
        name: 'Alex Doe',
        picture: 'https://nlux.ai/images/demos/persona-user.jpeg',
    };

    const message = createChatPictureDom(props);

    const nameInput = container.querySelector<HTMLSelectElement>('.controls .name')!;
    const urlInput = container.querySelector<HTMLSelectElement>('.controls .url')!;
    const select = container.querySelector<HTMLSelectElement>('.controls select')!;

    nameInput.value = props.name ?? '';
    urlInput.value = typeof props.picture === 'string' ? props.picture : '';
    select.value = 'url';

    nameInput.addEventListener('input', () => {
        const newProps: ChatPictureProps = {
            name: nameInput.value,
            picture: insertAs === 'url' ? urlInput.value : imgFromProps({
                name: nameInput.value,
                picture: urlInput.value,
            }),
        };

        updateChatPictureDom(message, props, newProps);
        props = newProps;
    });

    urlInput.addEventListener('input', () => {
        const newProps: ChatPictureProps = {
            name: nameInput.value,
            picture: insertAs === 'url' ? urlInput.value : imgFromProps({
                name: nameInput.value,
                picture: urlInput.value,
            }),
        };

        updateChatPictureDom(message, props, newProps);
        props = newProps;
    });

    select.addEventListener('change', () => {
        if (select.value === 'url') {
            insertAs = 'url';
            const newProps: ChatPictureProps = {
                name: nameInput.value,
                picture: urlInput.value,
            };

            updateChatPictureDom(message, props, newProps);
            props = newProps;
        } else {
            insertAs = 'img';
            const newProps: ChatPictureProps = {
                name: nameInput.value,
                picture: imgFromProps(props),
            };

            updateChatPictureDom(message, props, newProps);
            props = newProps;
        }
    });

    container.querySelector<HTMLDivElement>('.content')!.append(message);
});
