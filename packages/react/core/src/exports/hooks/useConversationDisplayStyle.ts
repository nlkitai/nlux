import {ConversationLayout} from '@nlux/core';
import {useMemo} from 'react';
import {getConversationLayout} from '../../../../../shared/src/utils/dom/getConversationLayout';
import {ConversationOptions} from '../../types/conversationOptions';

export const useConversationDisplayStyle = (conversationOptions?: ConversationOptions): ConversationLayout => {
    return useMemo(
        () => getConversationLayout(conversationOptions?.layout),
        [conversationOptions?.layout]
    );
};
