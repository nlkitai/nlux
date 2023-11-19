import {NluxRenderingError} from '../../../core/error';
import {CompRenderer} from '../../../types/comp';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {render} from '../../../x/render';
import {source} from '../../../x/source';
import {throttle} from '../../../x/throttle';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';
import {messagesScrollHandlerFactory} from './utils/messagesScrollHandler';

const __ = (styleName: string) => `nluxc-conversation-${styleName}`;

const html = () => `` +
    `<div class="${__('messages-container')}"></div>` +
    ``;

export const renderConversation: CompRenderer<
    CompConversationProps, CompConversationElements, CompConversationEvents, CompConversationActions
> = ({
    appendToRoot,
    compEvent,
}) => {
    const messagesContainer = render(html());
    if (!(messagesContainer instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('chat-room', 'render'),
            message: 'Conversation component could not be rendered',
        });
    }

    const scrollListeners = new Set<(...params: any[]) => void>();
    const messagesScrollHandler = messagesScrollHandlerFactory(
        ({scrolledToBottom}: {scrolledToBottom: boolean},
        ) => {
            compEvent('user-scrolled')({scrolledToBottom});
        });

    const [, removeMessagesContainerListeners] = listenToElement(messagesContainer)
        .on('scroll', throttle(messagesScrollHandler, 50))
        .get();

    appendToRoot(messagesContainer);

    return {
        elements: {
            messagesContainer,
        },
        onDestroy: () => {
            scrollListeners.clear();
            removeMessagesContainerListeners();
        },
    };
};
