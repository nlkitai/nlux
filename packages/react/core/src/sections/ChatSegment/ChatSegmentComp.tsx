import {
    createRef,
    forwardRef,
    ReactNode,
    Ref,
    RefObject,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import {AiBatchedMessage} from '@shared/types/chatSegment/chatSegmentAiMessage';
import {getChatSegmentClassName} from '@shared/utils/dom/getChatSegmentClassName';
import {warn, warnOnce} from '@shared/utils/warn';
import {ChatItemComp} from '../../components/ChatItem/ChatItemComp';
import {ChatItemImperativeProps} from '../../components/ChatItem/props';
import {LoaderComp} from '../../components/Loader/LoaderComp';
import {ChatSegmentImperativeProps, ChatSegmentProps} from './props';
import {isPrimitiveReactNodeType} from './utils/isPrimitiveReactNodeType';
import {participantNameFromRoleAndPersona} from '@shared/utils/chat/participantNameFromRoleAndPersona';
import {avatarFromMessageAndPersona} from './utils/avatarFromMessageAndPersona';

export const ChatSegmentComp: <AiMsg>(
    props: ChatSegmentProps<AiMsg>,
    ref: Ref<ChatSegmentImperativeProps<AiMsg>>,
) => ReactNode = function <AiMsg>(
    props: ChatSegmentProps<AiMsg>,
    ref: Ref<ChatSegmentImperativeProps<AiMsg>>,
): ReactNode {
    const {chatSegment, containerRef} = props;
    const [completeOnInitialRender, setCompleteOnInitialRender] = useState<boolean>(false);
    const chatItemsRef = useMemo(
        () => new Map<string, RefObject<ChatItemImperativeProps<AiMsg>>>(), [],
    );

    const chatItemsStreamingBuffer = useMemo(
        () => new Map<string, Array<AiMsg>>(), [],
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

        return (<div className={'nlux-chtSgm-ldr-cntr'}>{props.loader ?? <LoaderComp/>}</div>);
    }, [chatSegment.status, props.loader]);

    const rootClassName = useMemo(() => getChatSegmentClassName(chatSegment.status), [chatSegment.status]);

    useImperativeHandle(ref, () => ({
        streamChunk: (chatItemId: string, chunk: AiMsg) => {
            const chatItemCompRef = chatItemsRef.get(chatItemId);
            if (chatItemCompRef?.current) {
                chatItemCompRef.current.streamChunk(chunk);
            } else {
                // Buffer the chunk if the chat item is not rendered yet.
                const chatItemStreamingBuffer = chatItemsStreamingBuffer.get(chatItemId) ?? [];
                chatItemsStreamingBuffer.set(chatItemId, [...chatItemStreamingBuffer, chunk]);
            }
        },
        completeStream: (chatItemId: string) => {
            const chatItemCompRef = chatItemsRef.get(chatItemId);
            if (!chatItemCompRef?.current) {
                setCompleteOnInitialRender(true);
                return;
            }

            chatItemCompRef.current.completeStream();
            chatItemsRef.delete(chatItemId);
        },
    }), [
        // setCompleteOnInitialRender is not needed as a dependency here, even though it is used inside.
    ]);

    const ForwardRefChatItemComp = useMemo(() => forwardRef(
        ChatItemComp<AiMsg>,
    ), []);

    // Every time the chat segment is rendered, we check if there are any streamed chunks buffered waiting for a
    // chat item to be rendered. If buffered chunks are found, along with the chat item reference, we stream the chunks
    // to the chat item.
    useEffect(() => {
        if (chatItemsStreamingBuffer.size > 0) {
            chatItemsStreamingBuffer.forEach((bufferedChunks, chatItemId) => {
                const chatItemCompRef = chatItemsRef.get(chatItemId);
                if (chatItemCompRef?.current) {
                    // A chat item with buffered chunks is found.
                    bufferedChunks.forEach((chunk) => {
                        chatItemCompRef?.current?.streamChunk(chunk);
                    });
                    chatItemsStreamingBuffer.delete(chatItemId);

                    if (completeOnInitialRender) {
                        chatItemCompRef.current.completeStream();
                        setCompleteOnInitialRender(false);
                    }
                }
            });
        }
    }); // No dependencies — We always want to run this effect after every render.

    const chatItems = chatSegment.items;
    if (chatItems.length === 0) {
        return null;
    }

    return (
        <div className={rootClassName} ref={containerRef}>
            {chatItems.map((chatItem, index) => {
                let ref: RefObject<ChatItemImperativeProps<AiMsg>> | undefined = chatItemsRef.get(chatItem.uid);
                if (!ref) {
                    ref = createRef<ChatItemImperativeProps<AiMsg>>();
                    chatItemsRef.set(chatItem.uid, ref);
                }

                if (chatItem.participantRole === 'user') {
                    //
                    // User chat item — That should always be in complete state.
                    //
                    if (chatItem.status !== 'complete') {
                        warnOnce(
                            `User chat item should be always be in complete state — ` +
                            `Current status: ${(chatItem as AiBatchedMessage<AiMsg>).status} — ` +
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
                            direction={'sent'}
                            layout={props.layout}
                            promptRenderer={props.promptRenderer}
                            dataTransferMode={'batch'} // User chat items are always in batch mode.
                            fetchedContent={chatItem.content as AiMsg} // Same comp is used for user and AI chat items.
                            name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                            avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                            syntaxHighlighter={props.syntaxHighlighter}
                            htmlSanitizer={props.htmlSanitizer}
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
                                    direction={'received'}
                                    layout={props.layout}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    streamedContent={chatItem.content}
                                    responseRenderer={props.responseRenderer}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    htmlSanitizer={props.htmlSanitizer}
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
                                    direction={'received'}
                                    layout={props.layout}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    fetchedContent={chatItem.content}
                                    fetchedServerResponse={chatItem.serverResponse}
                                    responseRenderer={props.responseRenderer}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    htmlSanitizer={props.htmlSanitizer}
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
                                    direction={'received'}
                                    layout={props.layout}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    responseRenderer={props.responseRenderer}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    syntaxHighlighter={props.syntaxHighlighter}
                                    htmlSanitizer={props.htmlSanitizer}
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
