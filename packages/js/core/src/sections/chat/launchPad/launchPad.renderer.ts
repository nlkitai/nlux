import {createDefaultGreetingDom} from '@shared/components/DefaultGreeting/create';
import {createGreetingDom} from '@shared/components/Greeting/create';
import {updateGreetingDom} from '@shared/components/Greeting/update';
import {AssistantPersona} from '../../../aiChat/options/personaOptions';
import {CompRenderer} from '../../../types/comp';
import {ConversationStarter} from '../../../types/conversationStarter';
import {CompLaunchPadActions, CompLaunchPadElements, CompLaunchPadEvents, CompLaunchPadProps} from './launchPad.types';

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
        showGreeting: boolean;

        greetingElement?: HTMLElement,
        conversationStartersContainer?: HTMLElement,
    } = {
        assistantPersona: props.assistantPersona,
        conversationStarters: props.conversationStarters,
        showGreeting: props.showGreeting !== false,
    };

    //
    // Create greetings container
    // and append it to the root if personaOptions are provided
    //
    let greetingDom: HTMLElement | undefined;
    if (renderingContext.showGreeting) {
        if (props.assistantPersona) {
            const assistant = props.assistantPersona;
            greetingDom = createGreetingDom({
                name: assistant.name,
                avatar: assistant.avatar,
                message: assistant.tagline,
            });
        } else {
            // No assistant persona provided, render default greeting message
            // which is the NLUX logo
            greetingDom = createDefaultGreetingDom();
        }
    }

    if (greetingDom) {
        appendToRoot(greetingDom);
        renderingContext.greetingElement = greetingDom;
    }

    //
    // Containers
    //

    const conversationStartersContainer = document.createElement('div') as HTMLElement;
    conversationStartersContainer.classList.add('nlux-conversationStarters-container');
    appendToRoot(conversationStartersContainer);

    const resetGreeting = (showGreeting: boolean = true) => {
        renderingContext.showGreeting = showGreeting;

        if (renderingContext.greetingElement) {
            renderingContext.greetingElement.remove();
            renderingContext.greetingElement = undefined;
        }

        if (!showGreeting) {
            return;
        }

        renderingContext.greetingElement = renderingContext.assistantPersona
            ? createGreetingDom({
                name: renderingContext.assistantPersona.name,
                avatar: renderingContext.assistantPersona.avatar,
                message: renderingContext.assistantPersona.tagline,
            })
            : createDefaultGreetingDom();

        if (renderingContext.greetingElement) {
            conversationStartersContainer.insertAdjacentElement(
                'beforebegin',
                renderingContext.greetingElement,
            );
        }
    };

    return {
        elements: {
            conversationStartersContainer,
        },
        actions: {
            resetGreeting: (showGreeting: boolean = true) => {
                // This will reset the assistant greeting
                // It can either result in displaying the NLUX logo or the assistant greeting
                // depending on the assistant persona value provided
                resetGreeting(showGreeting);
            },
            updateAssistantPersona: (newValue: AssistantPersona | undefined) => {
                const previousAssistantPersona = renderingContext.assistantPersona;
                renderingContext.assistantPersona = newValue;

                // Nothing has changed, do nothing
                if ((!previousAssistantPersona && !newValue) || !renderingContext.showGreeting) {
                    return;
                }

                // This will remove the assistant greeting and display the NLUX logo
                if (!newValue) {
                    resetGreeting();
                    return;
                }

                if (previousAssistantPersona) {
                    // This will update the assistant greeting
                    updateGreetingDom(renderingContext.greetingElement!, {
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
                    resetGreeting();
                }
            },
        },
        onDestroy: () => {
            renderingContext.greetingElement?.remove();
            conversationStartersContainer.remove();
        },
    };
};
