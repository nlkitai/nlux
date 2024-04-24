import {createRef, forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useMemo, useRef} from 'react';
import {WelcomeMessageComp} from '../../ui/WelcomeMessage/WelcomeMessageComp';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {ChatSegmentImperativeProps} from '../ChatSegment/props';
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
    const hasAiPersona = personaOptions?.bot?.name && personaOptions.bot.picture;
    const showWelcomeMessage = hasAiPersona && !hasMessages;

    const lastSegmentContainerRef = createRef<HTMLDivElement>();
    const lastActiveSegmentDataReportedRef = useRef<{uid: string; div: HTMLDivElement} | undefined>(undefined);

    const chatSegmentsRef = useMemo(
        () => new Map<string, RefObject<ChatSegmentImperativeProps<any>>>(), [],
    );

    useEffect(() => {
        if (props.segments.length === 0) {
            chatSegmentsRef.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatSegmentsRef.keys());
        const itemsInSegments = new Set<string>(props.segments.map((segment) => segment.uid));
        for (const itemInRefsMap of itemsInRefsMap) {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatSegmentsRef.delete(itemInRefsMap);
            }
        }
    }, [props.segments]);

    const lastActiveSegmentId = useMemo(() => {
        const lastSegment = segments.length > 0 ? segments[segments.length - 1] : undefined;
        return lastSegment?.status === 'active' ? lastSegment.uid : undefined;
    }, [segments]);

    const ForwardRefChatSegmentComp = useMemo(() => forwardRef(
        ChatSegmentComp<AiMsg>,
    ), []);

    // Whenever the last active segment div+id changes, call the onLastActiveSegmentChange callback
    useEffect(() => {
        if (!onLastActiveSegmentChange) {
            return;
        }

        const lastReportedData = lastActiveSegmentDataReportedRef.current;
        if (lastActiveSegmentId === lastReportedData?.uid
            && lastSegmentContainerRef.current === lastReportedData?.div) {
            return;
        }

        const data = (lastActiveSegmentId && lastSegmentContainerRef.current) ? {
            uid: lastActiveSegmentId,
            div: lastSegmentContainerRef.current,
        } : undefined;

        if (!data && !lastActiveSegmentDataReportedRef.current) {
            return;
        }

        onLastActiveSegmentChange(data);
        lastActiveSegmentDataReportedRef.current = data;
    }); // No dependencies on purpose — we want to run this effect on every render cycle
    // 'if' statements inside the effect will prevent unnecessary calls to the callback

    useImperativeHandle(ref, () => ({
        streamChunk: (segmentId: string, messageId: string, chunk: string) => {
            const chatSegmentRef = chatSegmentsRef.get(segmentId);
            if (chatSegmentRef?.current) {
                chatSegmentRef.current.streamChunk(messageId, chunk);
            }
        },
    }), []);

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
                    let ref: RefObject<ChatSegmentImperativeProps<any>> | undefined = chatSegmentsRef.get(segment.uid);
                    if (!ref) {
                        ref = createRef();
                        chatSegmentsRef.set(segment.uid, ref);
                    }

                    return (
                        <ForwardRefChatSegmentComp
                            ref={ref}
                            key={segment.uid}
                            chatSegment={segment}
                            personaOptions={personaOptions}
                            loader={props.loader}
                            customRenderer={props.customRenderer}
                            syntaxHighlighter={props.syntaxHighlighter}
                            containerRef={isLastSegment ? lastSegmentContainerRef : undefined}
                        />
                    );
                })}
            </div>
        </>
    );
};
