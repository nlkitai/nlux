import {NluxRenderingError} from '../../../core/error';
import {BotPersona, UserPersona} from '../../../core/options/personaOptions';
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
import {createEmptyWelcomeMessage, createWelcomeMessage} from './utils/createWelcomeMessage';
import {messagesScrollHandlerFactory} from './utils/messagesScrollHandler';

export const __ = (styleName: string) => `nluxc-conversation-${styleName}`;

const html = () => `` +
    `<div class="${__('messages-container')}"></div>` +
    ``;

export const renderConversation: CompRenderer<
    CompConversationProps, CompConversationElements, CompConversationEvents, CompConversationActions
> = ({
    appendToRoot,
    compEvent,
    props,
}) => {
    const renderingContext: {
        botPersona: BotPersona | undefined;
        welcomeMessageContainer: HTMLElement | undefined;
        shouldRenderWelcomeMessage: boolean;
    } = {
        botPersona: props.botPersona,
        welcomeMessageContainer: undefined,
        shouldRenderWelcomeMessage: !props.messages || props.messages.length === 0,
    };

    const messagesContainer = render(html());
    if (!(messagesContainer instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('chat-room', 'render'),
            message: 'Conversation component could not be rendered',
        });
    }

    const scrollListeners = new Set<(...params: any[]) => void>();
    const messagesScrollHandler = messagesScrollHandlerFactory(
        (params) => {
            compEvent('user-scrolled')(params);
        },
    );

    const [, removeMessagesContainerListeners] = listenToElement(messagesContainer)
        .on('scroll', throttle(messagesScrollHandler, 50))
        .get();

    appendToRoot(messagesContainer);

    //
    // Create welcome message container
    // and append it to the root if personaOptions are provided
    //
    if (renderingContext.shouldRenderWelcomeMessage) {
        if (props.botPersona) {
            const bot = props.botPersona;
            renderingContext.welcomeMessageContainer = createWelcomeMessage(bot);
            if (renderingContext.welcomeMessageContainer) {
                messagesContainer.append(renderingContext.welcomeMessageContainer);
            }
        } else {
            renderingContext.welcomeMessageContainer = createEmptyWelcomeMessage();
        }
    }

    return {
        elements: {
            messagesContainer,
        },
        actions: {
            scrollToBottom: () => {
                // Using a very large number to make sure the scroll position is set to the bottom.
                // The alternative is to use scrollHeight, but that would result in an extra reflow - that can
                // be avoided by using a very large number.
                // Downside: if the scrollHeight is larger than the max value (50000 pixels), this will not work.
                messagesContainer.scrollTo({
                    top: 50000,
                    behavior: 'instant',
                });
            },
            removeWelcomeMessage: () => {
                if (renderingContext.welcomeMessageContainer) {
                    renderingContext.welcomeMessageContainer.remove();
                    renderingContext.welcomeMessageContainer = undefined;
                }
            },
            resetWelcomeMessage: () => {
                if (renderingContext.welcomeMessageContainer) {
                    renderingContext.welcomeMessageContainer.remove();
                    renderingContext.welcomeMessageContainer = undefined;
                }

                renderingContext.welcomeMessageContainer = renderingContext.botPersona
                    ? createWelcomeMessage(renderingContext.botPersona)
                    : createEmptyWelcomeMessage();

                if (renderingContext.welcomeMessageContainer) {
                    messagesContainer.append(renderingContext.welcomeMessageContainer);
                }
            },
            updateBotPersona: (newValue: BotPersona | undefined) => {
                renderingContext.botPersona = newValue;

                // If the welcome personas container is rendered, remove it and re-render it
                // This is different from resetWelcomeMessage, which removes the welcome message container
                // and ALWAYS re-renders it. Here we only re-render/update the welcome message container if it is
                // already rendered.
                if (renderingContext.welcomeMessageContainer) {
                    renderingContext.welcomeMessageContainer.remove();
                    renderingContext.welcomeMessageContainer = undefined;

                    renderingContext.welcomeMessageContainer = renderingContext.botPersona
                        ? createWelcomeMessage(renderingContext.botPersona)
                        : createEmptyWelcomeMessage();

                    if (renderingContext.welcomeMessageContainer) {
                        messagesContainer.append(renderingContext.welcomeMessageContainer);
                    }
                }
            },
            updateUserPersona: (newValue: UserPersona | undefined) => {
                // TODO - Update messages where user persona is used
            },
        },
        onDestroy: () => {
            scrollListeners.clear();
            removeMessagesContainerListeners();
        },
    };
};
