import {DomCreator} from '../../types/dom/DomCreator';
import {createAvatarDom} from '../Avatar/create';
import {AvatarProps} from '../Avatar/props';
import {createMessageDom} from '../Message/create';
import {MessageProps} from '../Message/props';
import {ChatItemProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';

export const className = 'nlux_comp_cht_itm';

export const createChatItemDom: DomCreator<ChatItemProps> = (
    props,
): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const messageProps: MessageProps = {
        direction: props.direction,
        status: props.status,
        loader: props.loader,
        message: props.message,
    };

    const message = createMessageDom(messageProps);

    if (props.name !== undefined || props.picture !== undefined) {
        const avatarProps: AvatarProps = {
            name: props.name,
            picture: props.picture,
        };
        const persona = createAvatarDom(avatarProps);
        element.append(persona);
    }

    applyNewDirectionClassName(element, props.direction);
    element.append(message);
    return element;
};
