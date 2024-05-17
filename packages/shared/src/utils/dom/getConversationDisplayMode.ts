import {ConversationDisplayMode, ConversationOptions} from '../../../../js/core/src';

export const getConversationDisplayMode = (conversationOptions: ConversationOptions): ConversationDisplayMode => {
    return conversationOptions?.displayMode ?? 'list';
};
