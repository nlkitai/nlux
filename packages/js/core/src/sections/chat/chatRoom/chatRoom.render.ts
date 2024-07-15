import {AnyAiMsg} from '@shared/types/anyAiMsg';
import {CompRenderer} from '../../../types/comp';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chatRoom.types';
import {getChatRoomStatus} from './utils/getChatRoomStatus';

export const renderChatRoom: CompRenderer<
    CompChatRoomProps<AnyAiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> = ({appendToRoot, compEvent, props}) => {

    //
    // The parent container for all messages, segments, and the actual conversation
    //
    const conversationContainer = document.createElement('div');
    conversationContainer.classList.add('nlux-conversation-container');

    //
    // The parent container for the composer
    // Contains the input field and submit button
    //
    const composerContainer = document.createElement('div');
    composerContainer.classList.add('nlux-composer-container');

    //
    // The parent container for the launch pad (shown when no messages are present)
    // Contains the assistant greeting and conversation starters
    //
    const launchPadContainer = document.createElement('div');
    launchPadContainer.classList.add('nlux-launchPad-container');

    //
    // Group and render all containers in a fragment before appending to the root
    //
    const dom = document.createDocumentFragment();
    dom.appendChild(launchPadContainer);
    dom.appendChild(conversationContainer);
    dom.appendChild(composerContainer);

    const visibleProp = props.visible ?? true;
    const chatRoomContainer = document.createElement('div');
    const setChatRoomStatusClass = (status: 'starting' | 'active') => {
        chatRoomContainer.classList.remove('nlux-chatRoom-starting');
        chatRoomContainer.classList.remove('nlux-chatRoom-active');
        chatRoomContainer.classList.add(`nlux-chatRoom-${status}`);
    };

    //
    // Render containers into main chat room div
    // And add listeners
    //
    chatRoomContainer.classList.add('nlux-chatRoom-container');
    setChatRoomStatusClass(
        getChatRoomStatus(props.initialConversationContent),
    );

    chatRoomContainer.append(dom);
    chatRoomContainer.style.display = visibleProp ? '' : 'none';

    const [_, removeConversationContainerListeners] = listenToElement(chatRoomContainer,
        ':scope > .nlux-conversation-container',
    ).on('click', compEvent('conversation-container-clicked'))
     .get();

    //
    // Render the chat room
    // And trigger ready event
    //
    appendToRoot(chatRoomContainer);
    compEvent('chat-room-ready')();

    return {
        elements: {
            composerContainer,
            conversationContainer,
            launchPadContainer,
        },
        actions: {
            updateChatRoomStatus: (newStatus) => {
                setChatRoomStatusClass(newStatus);
            },
        },
        onDestroy: () => {
            removeConversationContainerListeners();
        },
    };
};
