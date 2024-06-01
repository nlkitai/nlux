import {createRef, forwardRef, ReactNode, Ref, useImperativeHandle, useMemo} from 'react';
import {WelcomeDefaultMessageComp} from '../../components/DefaultWelcomeMessage/WelcomeDefaultMessageComp';
import {WelcomeMessageComp} from '../../components/WelcomeMessage/WelcomeMessageComp';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {ConversationStarters} from '../ConversationStarters/ConversationStarters';
import {useChatSegmentsController} from './hooks/useChatSegmentsController';
import {useLastActiveSegment} from './hooks/useLastActiveSegment';
import {ConversationCompProps, ImperativeConversationCompProps} from './props';

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
                <WelcomeDefaultMessageComp />
            )}
            {showWelcomeMessage && (
                <WelcomeMessageComp
                    name={personaOptions!.assistant!.name}
                    avatar={personaOptions!.assistant!.avatar}
                    message={personaOptions!.assistant!.tagline}
                />
            )}
            {showConversationStarters && (
                <ConversationStarters items={conversationOptions!.conversationStarters ?? []} />
            )}
            <div className="nlux-chtRm-cnv-sgmts-cntr">
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
                            chatSegment={segment}
                            personaOptions={personaOptions}
                            layout={props.layout}
                            loader={props.loader}
                            responseRenderer={props.responseRenderer}
                            promptRenderer={props.promptRenderer}
                            containerRef={isLastSegment ? lastSegmentContainerRef : undefined}
                            syntaxHighlighter={props.syntaxHighlighter}
                            htmlSanitizer={props.htmlSanitizer}
                            markdownLinkTarget={props.markdownLinkTarget}
                            showCodeBlockCopyButton={props.showCodeBlockCopyButton}
                            skipStreamingAnimation={props.skipStreamingAnimation}
                            streamingAnimationSpeed={props.streamingAnimationSpeed}
                        />
                    );
                })}
            </div>
        </>
    );
};
