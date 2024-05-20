import {ConversationLayout, ConversationOptions} from '../../../../js/core/src';

export const conversationDefaultLayout: ConversationLayout = 'list';

export const getConversationLayout = (conversationOptions: ConversationOptions): ConversationLayout => {
    return conversationOptions?.layout ?? conversationDefaultLayout;
};
