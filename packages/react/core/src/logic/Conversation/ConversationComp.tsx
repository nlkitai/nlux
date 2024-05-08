import {createRef, forwardRef, ReactNode, Ref, useImperativeHandle, useMemo} from 'react';
import {WelcomeMessageComp} from '../../ui/WelcomeMessage/WelcomeMessageComp';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {useChatSegmentsController} from './hooks/useChatSegmentsController';
import {useLastActiveSegment} from './hooks/useLastActiveSegment';
import {ConversationCompProps, ImperativeConversationCompProps} from './props';

export type ConversationCompType = <AiMsg>(
    props: ConversationCompProps<AiMsg>,
    ref: Ref<ImperativeConversationCompProps>,
) => ReactNode;

export const ConversationComp: ConversationCompType = function <AiMsg>(
    props: ConversationCompProps<AiMsg>,
    ref: Ref<ImperativeConversationCompProps>,
): ReactNode {
    const {
        segments,
        personaOptions,
        onLastActiveSegmentChange,
    } = props;

    const hasMessages = useMemo(() => segments.some((segment) => segment.items.length > 0), [segments]);
    const showWelcomeMessage = useMemo(
        () => !hasMessages && personaOptions?.bot !== undefined,
        [hasMessages, personaOptions],
    );

    const lastSegmentContainerRef = createRef<HTMLDivElement>();
    useLastActiveSegment<AiMsg>(segments, lastSegmentContainerRef, onLastActiveSegmentChange);

    const segmentsController = useChatSegmentsController<AiMsg>(segments);

    useImperativeHandle(ref, () => ({
        streamChunk: (segmentId: string, messageId: string, chunk: string) => {
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
            {showWelcomeMessage && (
                <WelcomeMessageComp
                    name={personaOptions!.bot!.name}
                    picture={personaOptions!.bot!.picture}
                    message={personaOptions!.bot!.tagline}
                />
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
                            loader={props.loader}
                            responseRenderer={props.responseRenderer}
                            containerRef={isLastSegment ? lastSegmentContainerRef : undefined}
                            syntaxHighlighter={props.syntaxHighlighter}
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
