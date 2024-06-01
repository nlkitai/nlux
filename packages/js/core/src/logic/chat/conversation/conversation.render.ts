import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {NluxRenderingError} from '../../../../../../shared/src/types/error';
import {createDefaultWelcomeMessageDom} from '../../../../../../shared/src/ui/DefaultWelcomeMessage/create';
import {createWelcomeMessageDom} from '../../../../../../shared/src/ui/WelcomeMessage/create';
import {AssistantPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {CompRenderer} from '../../../types/comp';
import {ConversationStarter} from '../../../types/conversationStarter';
import {source} from '../../../utils/source';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';
import {createConversationStartersDom} from './utils/createConversationStartersDom';

export const renderConversation: CompRenderer<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
> = ({
    appendToRoot,
    compEvent,
    props,
}) => {
    const hasNoMessages = !props.messages || props.messages.length === 0;
    const renderingContext: {
        assistantPersona: AssistantPersona | undefined;
        userPersona: UserPersona | undefined;
        conversationStarters: ConversationStarter[] | undefined;
        welcomeMessageContainer: HTMLElement | undefined;
        conversationStartersContainer: HTMLElement | undefined;
        shouldRenderWelcomeMessage: boolean;
        shouldRenderConversationStarters: boolean;
    } = {
        assistantPersona: props.assistantPersona,
        userPersona: props.userPersona,
        conversationStarters: props.conversationStarters,
        welcomeMessageContainer: undefined,
        conversationStartersContainer: undefined,
        shouldRenderWelcomeMessage: hasNoMessages && props.showWelcomeMessage !== false,
        shouldRenderConversationStarters: hasNoMessages && Array.isArray(props.conversationStarters) && props.conversationStarters.length > 0,
    };

    const segmentsContainer = document.createElement('div');
    segmentsContainer.classList.add('nlux-chtRm-cnv-sgmts-cntr');

    if (!(segmentsContainer instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source: source('chatRoom', 'render'),
            message: 'Conversation component could not be rendered',
        });
    }

    appendToRoot(segmentsContainer);

    //
    // Create welcome message container
    // and append it to the root if personaOptions are provided
    //
    if (renderingContext.shouldRenderWelcomeMessage) {
        if (props.assistantPersona) {
            const assistant = props.assistantPersona;
            renderingContext.welcomeMessageContainer = createWelcomeMessageDom({
                name: assistant.name,
                avatar: assistant.avatar,
                message: assistant.tagline,
            });
        } else {
            // No assistant persona provided, render default welcome message
            // which is the NLUX logo
            renderingContext.welcomeMessageContainer = createDefaultWelcomeMessageDom();
        }

        if (renderingContext.welcomeMessageContainer) {
            segmentsContainer.insertAdjacentElement('beforebegin', renderingContext.welcomeMessageContainer);
        }
    }

    //
    // Create conversation starters container
    // and append it to the root if conversation starters are provided
    //
    if (renderingContext.shouldRenderConversationStarters) {
        const conversationStartersContainer = createConversationStartersDom(props.conversationStarters!);
        renderingContext.conversationStartersContainer = conversationStartersContainer;
        segmentsContainer.insertAdjacentElement('beforebegin', conversationStartersContainer);
    }

    // Function to remove conversation starters
    const removeConversationStarters = () => {
        if (renderingContext.conversationStartersContainer) {
            renderingContext.conversationStartersContainer.remove();
            renderingContext.conversationStartersContainer = undefined;
        }
    };

    return {
        elements: {
            segmentsContainer,
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

                renderingContext.welcomeMessageContainer = renderingContext.assistantPersona
                    ? createWelcomeMessageDom({
                        name: renderingContext.assistantPersona.name,
                        avatar: renderingContext.assistantPersona.avatar,
                        message: renderingContext.assistantPersona.tagline,
                    })
                    : createDefaultWelcomeMessageDom();

                if (renderingContext.welcomeMessageContainer) {
                    segmentsContainer.insertAdjacentElement(
                        'beforebegin',
                        renderingContext.welcomeMessageContainer,
                    );
                }
            },
            updateAssistantPersona: (newValue: AssistantPersona | undefined) => {
                renderingContext.assistantPersona = newValue;

                // If the welcome personas container is rendered, remove it and re-render it
                // This is different from resetWelcomeMessage, which removes the welcome message container
                // and ALWAYS re-renders it. Here we only re-render/update the welcome message container if it is
                // already rendered.
                if (renderingContext.welcomeMessageContainer) {
                    renderingContext.welcomeMessageContainer.remove();
                    renderingContext.welcomeMessageContainer = undefined;

                    renderingContext.welcomeMessageContainer = renderingContext.assistantPersona
                        ? createWelcomeMessageDom({
                            name: renderingContext.assistantPersona.name,
                            avatar: renderingContext.assistantPersona.avatar,
                            message: renderingContext.assistantPersona.tagline,
                        })
                        : createDefaultWelcomeMessageDom();

                    if (renderingContext.welcomeMessageContainer) {
                        segmentsContainer.insertAdjacentElement(
                            'beforebegin',
                            renderingContext.welcomeMessageContainer,
                        );
                    }
                }
            },
            updateUserPersona: (newValue: UserPersona | undefined) => {
                renderingContext.userPersona = newValue;
            },
            updateConversationStarters: (conversationStarters: ConversationStarter[] | undefined) => {
                // Reset conversation starters
                renderingContext.conversationStarters = conversationStarters;
                removeConversationStarters();

                if (!conversationStarters || conversationStarters.length === 0) {
                    renderingContext.shouldRenderConversationStarters = false;
                    return;
                }

                const conversationStartersContainer = createConversationStartersDom(conversationStarters);
                segmentsContainer.insertAdjacentElement('beforebegin', conversationStartersContainer);

                renderingContext.conversationStartersContainer = conversationStartersContainer;
                renderingContext.shouldRenderConversationStarters = true;
            }
        },
    };
};
