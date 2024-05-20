import {ConversationLayout, ConversationOptions} from '../../../../js/core/src';

export const getConversationLayout = (conversationOptions: ConversationOptions): ConversationLayout => {
    return conversationOptions?.layout ?? 'list';
};
