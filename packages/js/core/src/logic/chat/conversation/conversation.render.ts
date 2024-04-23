import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {NluxRenderingError} from '../../../../../../shared/src/types/error';
import {render} from '../../../../../../shared/src/utils/dom/render';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {CompRenderer} from '../../../types/comp';
import {source} from '../../../utils/source';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';
import {createEmptyWelcomeMessage, createWelcomeMessage} from './utils/createWelcomeMessage';

export const __ = (styleName: string) => `nlux-chtRm-cnv-${styleName}`;

const html = () => `` +
    `<div class="${__('sgmts-cntr')}"></div>` +
    ``;

export const renderConversation: CompRenderer<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
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
            messagesContainer: messagesContainer,
        },
        actions: {
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
            updateUserPersona: (_newValue: UserPersona | undefined) => {
                // TODO - Update messages where user persona is used
            },
        },
        onDestroy: () => {
        },
    };
};
