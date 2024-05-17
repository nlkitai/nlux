import {ConversationDisplayMode, ConversationOptions} from '@nlux/core';
import {useMemo} from 'react';
import {getConversationDisplayMode} from '../../../../../shared/src/utils/dom/getConversationDisplayMode';

export const useConversationDisplayStyle = (conversationOptions?: ConversationOptions): ConversationDisplayMode => {
    return useMemo(() => getConversationDisplayMode(
        conversationOptions ?? {},
    ), [conversationOptions?.displayMode]);
};
