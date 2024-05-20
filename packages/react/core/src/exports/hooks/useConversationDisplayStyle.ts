import {ConversationLayout, ConversationOptions} from '@nlux/core';
import {useMemo} from 'react';
import {getConversationLayout} from '../../../../../shared/src/utils/dom/getConversationLayout';

export const useConversationDisplayStyle = (conversationOptions?: ConversationOptions): ConversationLayout => {
    return useMemo(() => getConversationLayout(
        conversationOptions ?? {},
    ), [conversationOptions?.layout]);
};
