import {ConversationStarter} from '../../../../types/conversationStarter';

export const createConversationStartersDom = (conversationStarters: ConversationStarter[]): HTMLElement => {
    const conversationStartersContainer = document.createElement('div');
    conversationStartersContainer.classList.add('nlux-comp-convStrts');

    conversationStarters.forEach((item, index) => {
        const conversationStarter = document.createElement('div');
        conversationStarter.classList.add('nlux-comp-convStrt');
        conversationStarter.textContent = item.prompt;
        conversationStartersContainer.appendChild(conversationStarter);
    });

    return conversationStartersContainer;
};