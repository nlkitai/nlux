import {DomCreator} from '../../types/dom/DomCreator';
import {createChatPictureDom} from '../ChatPicture/create';
import {ChatPictureProps} from '../ChatPicture/props';
import {createMessageDom} from '../Message/create';
import {MessageProps} from '../Message/props';
import {ConversationItemProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';

export const className = 'nlux_comp_cnv_itm';

export const createConversationItemDom: DomCreator<ConversationItemProps> = (
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
        const chatPictureProps: ChatPictureProps = {
            name: props.name,
            picture: props.picture,
        };
        const persona = createChatPictureDom(chatPictureProps);
        element.append(persona);
    }

    applyNewDirectionClassName(element, props.direction);
    element.append(message);
    return element;
};
