import {ConversationStarter} from '../../../types/conversationStarter';

export type CompConversationStartersEvents = 'conversation-starter-clicked';

export type CompConversationStartersProps = {
    conversationStarters: ConversationStarter[];
    onConversationStarterClick: (conversationStarter: ConversationStarter) => void;
};

export type CompConversationStartersElements = {
    // No elements
}

export type CompConversationStartersActions = {
    // No actions
};
