import {ConversationLayout} from '../../../../js/core/src';

export const conversationDefaultLayout: ConversationLayout = 'bubbles';

export const getConversationLayout = (layout?: ConversationLayout): ConversationLayout => {
    return layout ?? conversationDefaultLayout;
};
