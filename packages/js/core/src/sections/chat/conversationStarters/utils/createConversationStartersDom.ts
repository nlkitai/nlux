import {ConversationStarter} from '../../../../types/conversationStarter';

export const createConversationStartersDom = (conversationStarters: ConversationStarter[]): HTMLElement => {
    const conversationStartersContainer = document.createElement('div');
    conversationStartersContainer.classList.add('nlux-comp-conversationStarters');

    conversationStarters.forEach((item, index) => {
        const conversationStarter = document.createElement('button');
        conversationStarter.classList.add('nlux-comp-conversationStarter');

        const conversationStarterText = document.createElement('span');
        conversationStarterText.classList.add('nlux-comp-conversationStarter-prompt');
        conversationStarterText.textContent = item.prompt;

        conversationStarter.appendChild(conversationStarterText);
        conversationStartersContainer.appendChild(conversationStarter);
    });

    return conversationStartersContainer;
};
