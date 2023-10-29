import {NluxRenderingError} from '../../../core/error.ts';
import {listenToElement} from '../../../dom/listenToElement.ts';
import {CompRenderer} from '../../../types/comp.ts';
import {render} from '../../../x/render.ts';
import {source} from '../../../x/source.ts';
import {throttle} from '../../../x/throttle.ts';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './types.ts';
import {messagesScrollHandlerFactory} from './utils/messagesScrollHandler.ts';

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
