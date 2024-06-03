import {ConversationStarter} from '../../../../types/conversationStarter';

export const createConversationStartersDom = (conversationStarters: ConversationStarter[]): HTMLElement => {
    const conversationStartersContainer = document.createElement('div');
    conversationStartersContainer.classList.add('nlux-comp-conversationStarters');

    conversationStarters.forEach((item, index) => {
        const conversationStarter = document.createElement('button');
        conversationStarter.classList.add('nlux-comp-conversationStarter');
        conversationStarter.textContent = item.prompt;
        conversationStartersContainer.appendChild(conversationStarter);
    });

    return conversationStartersContainer;
};
