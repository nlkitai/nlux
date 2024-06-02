import {AnyAiMsg} from '@shared/types/anyAiMsg';
import {CompRenderer} from '../../../types/comp';
import {getElement} from '../../../utils/dom/getElement';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chatRoom.types';

export const renderChatRoom: CompRenderer<
    CompChatRoomProps<AnyAiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> = ({
         appendToRoot,
         compEvent,
         props,
     }) => {
    const conversationContainer = document.createElement('div');
    conversationContainer.classList.add('nlux-conversation-container');

    const composerContainer = document.createElement('div');
    composerContainer.classList.add('nlux-composer-container');

    const dom = document.createDocumentFragment();
    dom.appendChild(conversationContainer);
    dom.appendChild(composerContainer);

    const visibleProp = props.visible ?? true;
    const chatRoomElement = document.createElement('div');

    chatRoomElement.className = 'nlux-chatRoom-container';
    chatRoomElement.append(dom);
    chatRoomElement.style.display = visibleProp ? '' : 'none';

    const [conversationElement, removeMessagesContainerListeners] = listenToElement(chatRoomElement,
        ':scope > .nlux-conversation-container',
    ).on('click', compEvent('segments-container-clicked'))
        .get();

    const composerElement = getElement(chatRoomElement, ':scope > .nlux-composer-container');
    appendToRoot(chatRoomElement);
    compEvent('chat-room-ready')();

    return {
        elements: {
            chatRoomContainer: chatRoomElement,
            composerContainer: composerElement,
            conversationContainer: conversationElement,
        },
        onDestroy: () => {
            removeMessagesContainerListeners();
        },
    };
};
