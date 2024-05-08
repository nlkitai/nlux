import {createRef, forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useMemo} from 'react';
import {AiUnifiedMessage} from '../../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {getChatSegmentClassName} from '../../../../../shared/src/utils/dom/getChatSegmentClassName';
import {warn, warnOnce} from '../../../../../shared/src/utils/warn';
import {ChatItemComp} from '../../ui/ChatItem/ChatItemComp';
import {ChatItemImperativeProps} from '../../ui/ChatItem/props';
import {LoaderComp} from '../../ui/Loader/LoaderComp';
import {ChatSegmentImperativeProps, ChatSegmentProps} from './props';
import {isPrimitiveReactNodeType} from './utils/isPrimitiveReactNodeType';
import {nameFromMessageAndPersona} from './utils/nameFromMessageAndPersona';
import {pictureFromMessageAndPersona} from './utils/pictureFromMessageAndPersona';

export const ChatSegmentComp: <AiMsg>(
    props: ChatSegmentProps<AiMsg>,
    ref: Ref<ChatSegmentImperativeProps>,
) => ReactNode = function <AiMsg>(
    props: ChatSegmentProps<AiMsg>,
    ref: Ref<ChatSegmentImperativeProps>,
): ReactNode {
    const {chatSegment, containerRef} = props;
    const chatItemsRef = useMemo(
        () => new Map<string, RefObject<ChatItemImperativeProps>>(), [],
    );

    useEffect(() => {
        if (chatSegment.items.length === 0) {
            chatItemsRef.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatItemsRef.keys());
        const itemsInSegments = new Set<string>(chatSegment.items.map((item) => item.uid));
        itemsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatItemsRef.delete(itemInRefsMap);
            }
        });
    }, [chatSegment.items]);

    const loader = useMemo(() => {
        if (chatSegment.status !== 'active') {
            return null;
        }

        return (
            <div className={'nlux-chtSgm-ldr-cntr'}>
                {props.loader ?? <LoaderComp/>}
            </div>
        );
    }, [chatSegment.status, props.loader]);

    const rootClassName = useMemo(() => getChatSegmentClassName(chatSegment.status), [chatSegment.status]);

    useImperativeHandle(ref, () => ({
        streamChunk: (chatItemId: string, chunk: string) => {
            const chatItemCompRef = chatItemsRef.get(chatItemId);
            chatItemCompRef?.current?.streamChunk(chunk);
        },
        completeStream: (chatItemId: string) => {
            const chatItemCompRef = chatItemsRef.get(chatItemId);
            chatItemCompRef?.current?.completeStream();
            chatItemsRef.delete(chatItemId);
        },
    }), []);

    const ForwardRefChatItemComp = useMemo(() => forwardRef(
        ChatItemComp<AiMsg>,
    ), []);

    const chatItems = chatSegment.items;
    if (chatItems.length === 0) {
        return null;
    }

    return (
        <div className={rootClassName} ref={containerRef}>
            {chatItems.map((chatItem, index) => {
                let ref: RefObject<ChatItemImperativeProps> | undefined = chatItemsRef.get(chatItem.uid);
                if (!ref) {
                    ref = createRef<ChatItemImperativeProps>();
                    chatItemsRef.set(chatItem.uid, ref);
                }

                if (chatItem.participantRole === 'user') {
                    //
                    // User chat item — That should always be in complete state.
                    //
                    if (chatItem.status !== 'complete') {
                        warnOnce(
                            `User chat item should be always be in complete state — ` +
                            `Current status: ${(chatItem as AiUnifiedMessage<AiMsg>).status} — ` +
                            `Segment UID: ${chatSegment.uid}`,
                        );

                        return null;
                    }

                    if (!isPrimitiveReactNodeType(chatItem.content)) {
                        warnOnce(
                            `User chat item should have primitive content (string, number, boolean, null) — ` +
                            `Current content: ${JSON.stringify(chatItem.content)} — ` +
                            `Segment UID: ${chatSegment.uid}`,
                        );

                        return null;
                    }

                    return (
                        <ForwardRefChatItemComp
                            ref={ref}
                            key={chatItem.uid}
                            uid={chatItem.uid}
                            status={'complete'}
                            direction={'outgoing'}
                            message={chatItem.content}
                            name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                            picture={pictureFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                            syntaxHighlighter={props.syntaxHighlighter}
                            markdownLinkTarget={props.markdownLinkTarget}
                            showCodeBlockCopyButton={props.showCodeBlockCopyButton}
                            skipStreamingAnimation={props.skipStreamingAnimation}
                            streamingAnimationSpeed={props.streamingAnimationSpeed}
                        />
                    );
                } else {
                    //
                    // AI chat item — That should be in streaming or complete state.
                    //
                    if (chatItem.status === 'complete') {
                        //
                        // AI chat item in complete state.
                        //
                        if (chatItem.dataTransferMode === 'stream') {
                            //
                            // When the AI chat item is in complete state and the data transfer mode is stream,
                            // we do not render the message content — as it is streamed.
                            // We do not rely on custom renderer here since the content is streamed as string.
                            //
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'streaming'}
                                    direction={'incoming'}
                                    message={chatItem.content}
                                    responseRenderer={props.responseRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    markdownLinkTarget={props.markdownLinkTarget}
                                    showCodeBlockCopyButton={props.showCodeBlockCopyButton}
                                    skipStreamingAnimation={props.skipStreamingAnimation}
                                    streamingAnimationSpeed={props.streamingAnimationSpeed}
                                />
                            );
                        } else {
                            //
                            // When the AI chat item is in complete state and the data transfer mode is fetch,
                            // we render the message content. We also check if the content is primitive and if a custom
                            // renderer is provided.
                            //
                            if (!isPrimitiveReactNodeType(chatItem.content) && !props.responseRenderer) {
                                warn(
                                    `When the type of the AI chat content is not primitive (object or array), ` +
                                    `a custom renderer must be provided — ` +
                                    `Current content: ${JSON.stringify(chatItem.content)} — ` +
                                    `Segment UID: ${chatSegment.uid}`,
                                );

                                return null;
                            }

                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'complete'}
                                    direction={'incoming'}
                                    message={chatItem.content}
                                    responseRenderer={props.responseRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    markdownLinkTarget={props.markdownLinkTarget}
                                    showCodeBlockCopyButton={props.showCodeBlockCopyButton}
                                    skipStreamingAnimation={props.skipStreamingAnimation}
                                    streamingAnimationSpeed={props.streamingAnimationSpeed}
                                />
                            );
                        }
                    } else {
                        //
                        // AI chat item in streaming state.
                        // No need for custom renderer here.
                        //
                        if (chatItem.status === 'streaming') {
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'streaming'}
                                    direction={'incoming'}
                                    responseRenderer={props.responseRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    markdownLinkTarget={props.markdownLinkTarget}
                                    showCodeBlockCopyButton={props.showCodeBlockCopyButton}
                                    skipStreamingAnimation={props.skipStreamingAnimation}
                                    streamingAnimationSpeed={props.streamingAnimationSpeed}
                                />
                            );
                        }

                        // We do render a chat item on 'loading' or 'error' states:
                        // - On 'loading' state — A loading spinner will be displayed.
                        // - On 'error' state — An error message will be shown.
                    }

                    return null;
                }
            })}
            {loader}
        </div>
    );
};
