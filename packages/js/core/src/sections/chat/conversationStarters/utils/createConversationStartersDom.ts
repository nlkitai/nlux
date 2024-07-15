import {ConversationStarter} from '../../../../types/conversationStarter';

export const createConversationStartersDom = (
    conversationStarters: ConversationStarter[],
): HTMLElement => {
    const conversationStartersContainer = document.createElement('div');
    conversationStartersContainer.classList.add('nlux-comp-conversationStarters');

    conversationStarters.forEach((item, index) => {
        const conversationStarter = document.createElement('button');
        conversationStarter.classList.add('nlux-comp-conversationStarter');

        // start with empty html tag
        let conversationStarterIcon: HTMLElement = document.createElement('div');
        if (item.icon) {
            // if icon is specified
            // check if it is a string
            if (typeof item.icon === 'string') {
                conversationStarterIcon = document.createElement('img');
                conversationStarterIcon.setAttribute('src', item.icon);
                conversationStarterIcon.setAttribute('width', '16px');
            } else {
                // if not, icon must be a html element
                conversationStarterIcon.className =
                    'nlux-comp-conversationStarter-icon-container';

                conversationStarterIcon.appendChild(item.icon);
            }
        }

        const conversationStarterText = document.createElement('span');
        conversationStarterText.classList.add(
            'nlux-comp-conversationStarter-prompt',
        );
        conversationStarterText.textContent = item.label ?? item.prompt;

        conversationStarter.appendChild(conversationStarterIcon);
        conversationStarter.appendChild(conversationStarterText);
        conversationStartersContainer.appendChild(conversationStarter);
    });

    return conversationStartersContainer;
};
