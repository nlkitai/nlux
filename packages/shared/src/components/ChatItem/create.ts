import {DomCreator} from '../../types/dom/DomCreator';
import {createAvatarDom} from '../Avatar/create';
import {AvatarProps} from '../Avatar/props';
import {createMessageDom} from '../Message/create';
import {MessageProps} from '../Message/props';
import {ChatItemProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';
import {applyNewLayoutClassName} from './utils/applyNewLayoutClassName';

export const className = 'nlux-comp-chatItem';

export const participantInfoContainerClassName = 'nlux-comp-chatItem-participantInfo';
export const participantNameClassName = 'nlux-comp-chatItem-participantName';

export const createChatItemDom: DomCreator<ChatItemProps> = (
    props,
): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const messageProps: MessageProps = {
        direction: props.direction,
        status: props.status,
        message: props.message,
    };

    // Create an avatar if avatar is provided
    let avatarDom: HTMLElement | undefined;
    if (props.avatar !== undefined) {
        const avatarProps: AvatarProps = {
            name: props.name,
            avatar: props.avatar,
        };

        avatarDom = createAvatarDom(avatarProps);
    }

    // Create name
    const participantNameDom = document.createElement('span');
    participantNameDom.classList.add(participantNameClassName);
    participantNameDom.textContent = props.name;

    // Add persona and name
    {
        const participantInfoContainer = document.createElement('div');
        participantInfoContainer.classList.add(participantInfoContainerClassName);

        if (avatarDom !== undefined) {
            participantInfoContainer.append(avatarDom);
        }

        participantInfoContainer.append(participantNameDom);
        element.append(participantInfoContainer);
    }

    applyNewDirectionClassName(element, props.direction);
    applyNewLayoutClassName(element, props.layout);

    const message = createMessageDom(messageProps);
    element.append(message);
    return element;
};
