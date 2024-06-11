import {ConversationStarter} from '../../types/conversationStarter';

export type ConversationStartersProps = {
    items: ConversationStarter[];
    onConversationStarterSelected: (conversationStarter: ConversationStarter) => void;
};
