import {ConversationLayout} from '../../../../js/core/src';

export const conversationDefaultLayout: ConversationLayout = 'list';

export const getConversationLayout = (layout?: ConversationLayout): ConversationLayout => {
    return layout ?? conversationDefaultLayout;
};
