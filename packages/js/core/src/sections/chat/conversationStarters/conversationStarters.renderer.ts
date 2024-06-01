import {CompRenderer} from '../../../types/comp';
import {
    CompConversationStartersActions,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersProps,
} from './conversationStarters.types';

export const renderConversationStarters: CompRenderer<
    CompConversationStartersProps,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersActions
> = ({
         appendToRoot,
         props,
     }) => {
    const conversationStartersContainer = document.createElement('div');
    conversationStartersContainer.classList.add('nlux-comp-convStrts-cntr');

    const conversationStarters = document.createElement('div');
    conversationStarters.classList.add('nlux-comp-convStrts');
    conversationStartersContainer.appendChild(conversationStarters);

    props.items.forEach((item, index) => {
        const conversationStarter = document.createElement('div');
        conversationStarter.classList.add('nlux-comp-convStrt');
        conversationStarter.textContent = item.prompt;
        conversationStarters.appendChild(conversationStarter);
    });

    appendToRoot(conversationStartersContainer);

    return {
        elements: {
            conversationStarters: conversationStartersContainer,
        },
        actions: {},
    };
};
