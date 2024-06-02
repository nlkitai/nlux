import {createRef, forwardRef, ReactNode, Ref, useImperativeHandle, useMemo} from 'react';
import {WelcomeDefaultMessageComp} from '../../components/DefaultWelcomeMessage/WelcomeDefaultMessageComp';
import {WelcomeMessageComp} from '../../components/WelcomeMessage/WelcomeMessageComp';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {ConversationStarters} from '../ConversationStarters/ConversationStarters';
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

    const hasMessages = useMemo(() => segments.some((segment) => segment.items.length > 0), [segments]);
    const showWelcomeDefaultMessage = useMemo(
        () => !hasMessages && personaOptions?.assistant === undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const conversationLayout = useConversationDisplayStyle(conversationOptions);

    const showWelcomeMessage = useMemo(
        () => !hasMessages && personaOptions?.assistant !== undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const showConversationStarters = useMemo(
        () => !hasMessages && conversationOptions?.conversationStarters && conversationOptions?.conversationStarters.length > 0,
        [hasMessages, conversationOptions?.conversationStarters],
    );

    const lastSegmentContainerRef = createRef<HTMLDivElement>();
    useLastActiveSegment<AiMsg>(segments, lastSegmentContainerRef, onLastActiveSegmentChange);

    const segmentsController = useChatSegmentsController<AiMsg>(segments);

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
        <>
            {showWelcomeDefaultMessage && (
                <WelcomeDefaultMessageComp/>
            )}
            {showWelcomeMessage && (
                <WelcomeMessageComp
                    name={personaOptions!.assistant!.name}
                    avatar={personaOptions!.assistant!.avatar}
                    message={personaOptions!.assistant!.tagline}
                />
            )}
            <div className="nlux-conversationStarters-container">
                {showConversationStarters && (
                    <ConversationStarters
                        items={conversationOptions!.conversationStarters ?? []}
                        onConversationStarterSelected={props.onConversationStarterSelected}
                    />
                )}
            </div>
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
        </>
    );
};
