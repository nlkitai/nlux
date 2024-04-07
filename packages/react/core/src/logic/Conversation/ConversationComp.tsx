import {createRef, forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useMemo} from 'react';
import {WelcomeMessageComp} from '../../ui/WelcomeMessage/WelcomeMessageComp';
import {ChatSegmentComp} from '../ChatSegment/ChatSegmentComp';
import {ChatSegmentImperativeProps} from '../ChatSegment/props';
import {ConversationCompProps, ImperativeConversationCompProps} from './props';


export type ConversationCompType = <MessageType>(
    props: ConversationCompProps<MessageType>,
    ref: Ref<ImperativeConversationCompProps>,
) => ReactNode;

export const ConversationComp: ConversationCompType = function <MessageType>(
    props: ConversationCompProps<MessageType>,
    ref: Ref<ImperativeConversationCompProps>,
): ReactNode {
    const {segments, personaOptions} = props;
    const hasMessages = useMemo(() => segments.some((segment) => segment.items.length > 0), [segments]);
    const hasAiPersona = personaOptions?.bot?.name && personaOptions.bot.picture;
    const showWelcomeMessage = hasAiPersona && !hasMessages;

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

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            // TODO - Implement scroll to bottom
        },
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
            {segments.map((segment) => {
                let ref: RefObject<ChatSegmentImperativeProps<any>> | undefined = chatSegmentsRef.get(segment.uid);
                if (!ref) {
                    ref = createRef();
                    chatSegmentsRef.set(segment.uid, ref);
                }

                const ForwardRefChatItemComp = forwardRef(
                    ChatSegmentComp<MessageType>,
                );

                return (
                    <ForwardRefChatItemComp
                        ref={ref}
                        key={segment.uid}
                        chatSegment={segment}
                        personaOptions={personaOptions}
                        loader={props.loader}
                        customRenderer={props.customRenderer}
                        syntaxHighlighter={props.syntaxHighlighter}
                    />
                );
            })}
        </>
    );
};
