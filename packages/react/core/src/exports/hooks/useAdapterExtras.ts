import {ChatAdapterExtras} from '@nlux/core';
import {useMemo} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {chatSegmentsToChatItems} from '../../utils/chatSegmentsToChatItems';
import {reactPropsToCoreProps} from '../../utils/reactPropsToCoreProps';
import {AiChatProps} from '../props';

export const useAdapterExtras = <AiMsg>(
    aiChatProps: AiChatProps<AiMsg>,
    chatSegments: ChatSegment<AiMsg>[],
): ChatAdapterExtras<AiMsg> => {
    return useMemo(() => {
        return {
            aiChatProps: reactPropsToCoreProps<AiMsg>(aiChatProps),
            conversationHistory: chatSegmentsToChatItems(chatSegments),
        };

    }, [aiChatProps, chatSegments]);
};
