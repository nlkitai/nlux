import {useMemo} from 'react';
import {HistoryPayloadSize} from '../../../../../js/core/src';
import {ChatAdapterExtras} from '../../../../../shared/src/types/adapters/chat/chatAdapterExtras';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {chatSegmentsToChatItems} from '../../../../../shared/src/utils/chat/chatSegmentsToChatItems';
import {reactPropsToCoreProps} from '../../utils/reactPropsToCoreProps';
import {AiChatProps} from '../props';

export const useAdapterExtras = <AiMsg>(
    aiChatProps: AiChatProps<AiMsg>,
    chatSegments: ChatSegment<AiMsg>[],
    historyPayloadSize?: HistoryPayloadSize,
): ChatAdapterExtras<AiMsg> => {
    return useMemo(() => {
        const allHistory = chatSegmentsToChatItems(chatSegments);
        const conversationHistory = (historyPayloadSize === 'max' || historyPayloadSize === undefined)
            ? allHistory
            : (historyPayloadSize > 0)
                ? allHistory.slice(-historyPayloadSize)
                : undefined;

        return {
            aiChatProps: reactPropsToCoreProps<AiMsg>(aiChatProps),
            conversationHistory,
        };

    }, [aiChatProps, chatSegments, historyPayloadSize]);
};
