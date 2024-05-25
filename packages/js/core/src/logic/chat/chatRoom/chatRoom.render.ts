import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {CompRenderer} from '../../../types/comp';
import {getElement} from '../../../utils/dom/getElement';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chatRoom.types';

const __ = (styleName: string) => `nlux-chtRm-${styleName}`;

export const renderChatRoom: CompRenderer<
    CompChatRoomProps<AnyAiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> = ({
    appendToRoot,
    compEvent,
    props,
}) => {
    const conversationContainer = document.createElement('div');
    conversationContainer.classList.add(__('cnv-cntr'));

    const composerContainer = document.createElement('div');
    composerContainer.classList.add(__('prmptBox-cntr'));

    const dom = document.createDocumentFragment();
    dom.appendChild(conversationContainer);
    dom.appendChild(composerContainer);

    const visibleProp = props.visible ?? true;
    const chatRoomElement = document.createElement('div');

    chatRoomElement.className = __('cntr');
    chatRoomElement.append(dom);
    chatRoomElement.style.display = visibleProp ? '' : 'none';

    const [conversationElement, removeMessagesContainerListeners] = listenToElement(chatRoomElement,
        `:scope > .${__('cnv-cntr')}`,
    ).on('click', compEvent('segments-container-clicked'))
     .get();

    const composerElement = getElement(chatRoomElement, `:scope > .${__('prmptBox-cntr')}`);
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
