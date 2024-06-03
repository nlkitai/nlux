import {ConversationStarter} from '../../../types/conversationStarter';

export type CompConversationStartersEvents = 'conversation-starter-selected';

export type CompConversationStartersProps = {
    conversationStarters: ConversationStarter[];
    onConversationStarterSelected: (conversationStarter: ConversationStarter) => void;
};

export type CompConversationStartersElements = {
    // No elements
}

export type CompConversationStartersActions = {
    // No actions
};
