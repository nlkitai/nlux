import {CompRenderer} from '../../../types/comp';
import {CompLaunchPadActions, CompLaunchPadElements, CompLaunchPadEvents, CompLaunchPadProps} from './launchPad.types';
import {AssistantPersona} from '../../../aiChat/options/personaOptions';
import {ConversationStarter} from '../../../types/conversationStarter';
import {createWelcomeMessageDom} from '@shared/components/WelcomeMessage/create';
import {createDefaultWelcomeMessageDom} from '@shared/components/DefaultWelcomeMessage/create';
import {updateWelcomeMessageDom} from '@shared/components/WelcomeMessage/update';

export const renderLaunchPad: CompRenderer<
    CompLaunchPadProps,
    CompLaunchPadElements,
    CompLaunchPadEvents,
    CompLaunchPadActions
> = ({appendToRoot, props},
) => {

    const renderingContext: {
        assistantPersona: AssistantPersona | undefined;
        conversationStarters: ConversationStarter[] | undefined;
        showWelcomeMessage: boolean;

        welcomeMessageElement?: HTMLElement,
        conversationStartersContainer?: HTMLElement,
    } = {
        assistantPersona: props.assistantPersona,
        conversationStarters: props.conversationStarters,
        showWelcomeMessage: props.showWelcomeMessage !== false,
    };

    //
    // Create welcome message container
    // and append it to the root if personaOptions are provided
    //
    let welcomeMessageDom: HTMLElement | undefined;
    if (renderingContext.showWelcomeMessage) {
        if (props.assistantPersona) {
            const assistant = props.assistantPersona;
            welcomeMessageDom = createWelcomeMessageDom({
                name: assistant.name,
                avatar: assistant.avatar,
                message: assistant.tagline,
            });
        } else {
            // No assistant persona provided, render default welcome message
            // which is the NLUX logo
            welcomeMessageDom = createDefaultWelcomeMessageDom();
        }
    }

    if (welcomeMessageDom) {
        appendToRoot(welcomeMessageDom);
        renderingContext.welcomeMessageElement = welcomeMessageDom;
    }

    //
    // Containers
    //

    const conversationStartersContainer = document.createElement('div') as HTMLElement;
    conversationStartersContainer.classList.add('nlux-conversationStarters-container');
    appendToRoot(conversationStartersContainer);

    const resetWelcomeMessage = (showWelcomeMessage: boolean = true) => {
        renderingContext.showWelcomeMessage = showWelcomeMessage;

        if (renderingContext.welcomeMessageElement) {
            renderingContext.welcomeMessageElement.remove();
            renderingContext.welcomeMessageElement = undefined;
        }

        if (!showWelcomeMessage) {
            return;
        }

        renderingContext.welcomeMessageElement = renderingContext.assistantPersona
            ? createWelcomeMessageDom({
                name: renderingContext.assistantPersona.name,
                avatar: renderingContext.assistantPersona.avatar,
                message: renderingContext.assistantPersona.tagline,
            })
            : createDefaultWelcomeMessageDom();

        if (renderingContext.welcomeMessageElement) {
            conversationStartersContainer.insertAdjacentElement(
                'beforebegin',
                renderingContext.welcomeMessageElement,
            );
        }
    };

    return {
        elements: {
            conversationStartersContainer,
        },
        actions: {
            resetWelcomeMessage: (showWelcomeMessage: boolean = true) => {
                // This will reset the assistant greeting
                // It can either result in displaying the NLUX logo or the assistant greeting
                // depending on the assistant persona value provided
                resetWelcomeMessage(showWelcomeMessage);
            },
            updateAssistantPersona: (newValue: AssistantPersona | undefined) => {
                const previousAssistantPersona = renderingContext.assistantPersona;
                renderingContext.assistantPersona = newValue;

                // Nothing has changed, do nothing
                if ((!previousAssistantPersona && !newValue) || !renderingContext.showWelcomeMessage) {
                    return;
                }

                // This will remove the assistant greeting and display the NLUX logo
                if (!newValue) {
                    resetWelcomeMessage();
                    return;
                }

                if (previousAssistantPersona) {
                    // This will update the assistant greeting
                    updateWelcomeMessageDom(renderingContext.welcomeMessageElement!, {
                        name: previousAssistantPersona?.name,
                        avatar: previousAssistantPersona?.avatar,
                        message: previousAssistantPersona?.tagline,
                    }, {
                        name: newValue.name,
                        avatar: newValue.avatar,
                        message: newValue.tagline,
                    });
                } else {
                    // This will add the assistant greeting
                    resetWelcomeMessage();
                }
            },
        },
        onDestroy: () => {
            renderingContext.welcomeMessageElement?.remove();
            conversationStartersContainer.remove();
        },
    };
};
