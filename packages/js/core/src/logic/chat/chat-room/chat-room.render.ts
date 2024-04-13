import {NluxRenderingError} from '../../../exports/error';
import {CompRenderer} from '../../../types/comp';
import {getElement} from '../../../utils/dom/getElement';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {render} from '../../../utils/render';
import {source} from '../../../utils/source';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chat-room.types';

const __ = (styleName: string) => `nlux-chtRm-${styleName}`;

const html = () => `` +
    `<div class="${__('conversation-container')}"></div>` +
    `<div class="${__('prompt-box-container')}"></div>` +
    ``;

export const renderChatRoom: CompRenderer<
    CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> = ({
    appendToRoot,
    compEvent,
    props,
}) => {
    const dom = render(html());
    if (!dom) {
        throw new NluxRenderingError({
            source: source('chat-room', 'render'),
            message: 'Chat room could not be rendered',
        });
    }

    const visibleProp = props.visible ?? true;
    const chatRoomElement = document.createElement('div');

    chatRoomElement.className = __('cntr');
    chatRoomElement.append(dom);
    chatRoomElement.style.display = visibleProp ? '' : 'none';

    const [conversationElement, removeMessagesContainerListeners] = listenToElement(chatRoomElement,
        `:scope > .${__('conversation-container')}`,
    ).on('click', compEvent('messages-container-clicked'))
     .get();

    const promptBoxElement = getElement(chatRoomElement, `:scope > .${__('prompt-box-container')}`);
    appendToRoot(chatRoomElement);
    compEvent('chat-room-ready')();

    return {
        elements: {
            chatRoomContainer: chatRoomElement,
            promptBoxContainer: promptBoxElement,
            conversationContainer: conversationElement,
        },
        onDestroy: () => {
            removeMessagesContainerListeners();
        },
    };
};
