import {ComposerStatus} from '@shared/components/Composer/props';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {Dispatch, RefObject, SetStateAction, useCallback} from 'react';
import {ImperativeConversationCompProps} from '../../sections/Conversation/props';

export const useCancelLastMessage = function <AiMsg>(
    newSegments: ChatSegment<AiMsg>[],
    cancelledSegmentIds: string[],
    cancelledMessageIds: string[],
    setChatSegments: Dispatch<SetStateAction<ChatSegment<AiMsg>[]>>,
    setCancelledSegmentIds: Dispatch<SetStateAction<string[]>>,
    setCancelledMessageIds: Dispatch<SetStateAction<string[]>>,
    conversationRef: RefObject<ImperativeConversationCompProps<AiMsg>>,
    setComposerStatus: Dispatch<SetStateAction<ComposerStatus>>,
) {
    return useCallback(() => {
        const lastSegment = newSegments.length > 0 ? newSegments[newSegments.length - 1] : undefined;
        if (lastSegment?.status === 'active') {
            // Remove the last message from the conversation
            setChatSegments(newSegments.slice(0, -1));
            setCancelledSegmentIds([...cancelledSegmentIds, lastSegment.uid]);
            setCancelledMessageIds([
                ...cancelledMessageIds,
                ...lastSegment.items.map(item => item.uid),
            ]);

            // TODO - Cancel the HTTP request if it is still pending or streaming

            // Instructions to cancel markdown streaming, if it is still active
            conversationRef.current?.cancelSegmentStreams(lastSegment.uid);
        }

        setComposerStatus('typing');
    }, [
        newSegments,
        cancelledSegmentIds,
        cancelledMessageIds,
        setChatSegments,
        setCancelledSegmentIds,
        setCancelledMessageIds,
        conversationRef,
        setComposerStatus,
    ]);
};
