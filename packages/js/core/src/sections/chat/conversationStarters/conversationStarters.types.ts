import {ConversationStarter} from '../../../types/conversationStarter';

export type CompConversationStartersEvents = 'conversation-starter-selected';

export type CompConversationStartersProps = {
    conversationStarters: ConversationStarter[];
    onConversationStarterSelected: (conversationStarter: ConversationStarter) => void;
};

export type CompConversationStartersElements = Record<string, never>;

export type CompConversationStartersActions = Record<string, never>;
