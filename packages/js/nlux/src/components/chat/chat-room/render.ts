import {NluxRenderingError} from '../../../core/error.ts';
import {getElement} from '../../../dom/getElement';
import {listenToElement} from '../../../dom/listenToElement';
import {CompRenderer} from '../../../types/comp';
import {render} from '../../../x/render.ts';
import {source} from '../../../x/source.ts';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './types';

const __ = (styleName: string) => `nluxc-chat-room-${styleName}`;

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

    chatRoomElement.className = 'nluxc-chat-room-container';
    chatRoomElement.append(dom);
    chatRoomElement.style.display = visibleProp ? '' : 'none';

    if (typeof props.containerMaxHeight === 'number') {
        chatRoomElement.style.maxHeight = `${props.containerMaxHeight}px`;
    }

    const [conversationElement, removeMessagesContainerListeners] = listenToElement(chatRoomElement,
        `:scope > .${__('conversation-container')}`)
        .on('click', compEvent('messages-container-clicked'))
        .get();

    const promptBoxElement = getElement(chatRoomElement, `:scope > .${__('prompt-box-container')}`);
    appendToRoot(chatRoomElement);

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
