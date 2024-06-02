import {createRef, forwardRef, ReactNode, Ref, useImperativeHandle, useMemo} from 'react';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {useChatSegmentsController} from './hooks/useChatSegmentsController';
import {useLastActiveSegment} from './hooks/useLastActiveSegment';
import {ConversationCompProps, ImperativeConversationCompProps} from './props';
import {useConversationDisplayStyle} from '../../exports/hooks/useConversationDisplayStyle';

export type ConversationCompType = <AiMsg>(
    props: ConversationCompProps<AiMsg>,
    ref: Ref<ImperativeConversationCompProps<AiMsg>>,
) => ReactNode;

export const ConversationComp: ConversationCompType = function <AiMsg>(
    props: ConversationCompProps<AiMsg>,
    ref: Ref<ImperativeConversationCompProps<AiMsg>>,
): ReactNode {
    const {
        segments,
        personaOptions,
        conversationOptions,
        onLastActiveSegmentChange,
    } = props;

    const lastSegmentContainerRef = createRef<HTMLDivElement>();
    useLastActiveSegment<AiMsg>(segments, lastSegmentContainerRef, onLastActiveSegmentChange);

    const segmentsController = useChatSegmentsController<AiMsg>(segments);
    const conversationLayout = useConversationDisplayStyle(conversationOptions);

    useImperativeHandle(ref, () => ({
        streamChunk: (segmentId: string, messageId: string, chunk: AiMsg) => {
            const chatSegment = segmentsController.get(segmentId);
            chatSegment?.streamChunk(messageId, chunk);
        },
        completeStream: (segmentId: string, messageId: string) => {
            const chatSegment = segmentsController.get(segmentId);
            chatSegment?.completeStream(messageId);
        },
    }), []);

    const ForwardRefChatSegmentComp = useMemo(() => forwardRef(
        ChatSegmentComp<AiMsg>,
    ), []);

    return (
        <div className="nlux-chatSegments-container">
            {segments.map((segment, index) => {
                const isLastSegment = index === segments.length - 1;
                let ref = segmentsController.getRef(segment.uid);
                if (!ref) {
                    ref = createRef();
                    segmentsController.set(segment.uid, ref);
                }

                return (
                    <ForwardRefChatSegmentComp
                        ref={ref}
                        key={segment.uid}
                        containerRef={isLastSegment ? lastSegmentContainerRef : undefined}
                        chatSegment={segment}
                        layout={conversationLayout}
                        loader={props.loader}
                        personaOptions={personaOptions}
                        messageOptions={props.messageOptions}
                    />
                );
            })}
        </div>
    );
};
