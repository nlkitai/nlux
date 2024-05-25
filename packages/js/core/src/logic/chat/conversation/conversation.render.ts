import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {NluxRenderingError} from '../../../../../../shared/src/types/error';
import {createWelcomeMessageDom} from '../../../../../../shared/src/ui/WelcomeMessage/create';
import {AssistantPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {CompRenderer} from '../../../types/comp';
import {source} from '../../../utils/source';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';

export const __ = (styleName: string) => `nlux-chtRm-cnv-${styleName}`;

export const renderConversation: CompRenderer<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
> = ({
    appendToRoot,
    compEvent,
    props,
}) => {
    const renderingContext: {
        assistantPersona: AssistantPersona | undefined;
        userPersona: UserPersona | undefined;
        welcomeMessageContainer: HTMLElement | undefined;
        shouldRenderWelcomeMessage: boolean;
    } = {
        assistantPersona: props.assistantPersona,
        userPersona: props.userPersona,
        welcomeMessageContainer: undefined,
        shouldRenderWelcomeMessage: !props.messages || props.messages.length === 0,
    };

    const segmentsContainer = document.createElement('div');
    segmentsContainer.classList.add(__('sgmts-cntr'));

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

            if (renderingContext.welcomeMessageContainer) {
                segmentsContainer.insertAdjacentElement('beforebegin', renderingContext.welcomeMessageContainer);
            }
        }
    }

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
                    : undefined;

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
                        : undefined;

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
        },
    };
};
