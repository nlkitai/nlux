import React, {
    createRef,
    forwardRef, FunctionComponent, isValidElement,
    ReactNode,
    Ref,
    RefObject,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {AiBatchedMessage} from '@shared/types/chatSegment/chatSegmentAiMessage';
import {getChatSegmentClassName} from '@shared/utils/dom/getChatSegmentClassName';
import {warn, warnOnce} from '@shared/utils/warn';
import {ChatItemComp} from '../ChatItem/ChatItemComp';
import {ChatItemImperativeProps} from '../ChatItem/props';
import {ChatSegmentImperativeProps, ChatSegmentProps} from './props';
import {isPrimitiveReactNodeType} from './utils/isPrimitiveReactNodeType';
import {participantNameFromRoleAndPersona} from '@shared/utils/chat/participantNameFromRoleAndPersona';
import {avatarFromMessageAndPersona} from './utils/avatarFromMessageAndPersona';
import {StreamedServerComponent} from '@shared/types/adapters/chat/serverComponentChatAdapter';

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

    const serverComponentsRef = useRef<Map<string, ReactNode>>(
        new Map(),
    );

    const serverComponentsFunctionsRef = useRef<Map<string, FunctionComponent>>(
        new Map<string, FunctionComponent>(),
    );

    const chatItemsStreamingBuffer = useMemo(
        () => new Map<string, Array<AiMsg>>(), [],
    );

    useEffect(() => {
        if (chatSegment.items.length === 0) {
            chatItemsRef.clear();
            serverComponentsRef.current.clear();
            serverComponentsFunctionsRef.current.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatItemsRef.keys());
        const itemsInSegments = new Set<string>(chatSegment.items.map((item) => item.uid));
        itemsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatItemsRef.delete(itemInRefsMap);
            }
        });

        const serverComponentsInRefsMap = new Set<string>(serverComponentsRef.current.keys());
        serverComponentsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                serverComponentsRef.current.delete(itemInRefsMap);
                serverComponentsFunctionsRef.current.delete(itemInRefsMap);
            }
        });
    }, [chatSegment.items]);

    const Loader = useMemo(() => {
        if (chatSegment.status !== 'active') {
            return null;
        }

        return (<div className={'nlux-chatSegment-loader-container'}>{props.Loader}</div>);
    }, [chatSegment.status, props.Loader]);

    const rootClassName = useMemo(() => getChatSegmentClassName(chatSegment.status), [chatSegment.status]);

    useImperativeHandle(ref, () => ({
        streamChunk: (chatItemId: string, chunk: AiMsg) => {
            const chatItemCompRef = chatItemsRef.get(chatItemId);
            if (chatItemCompRef?.current) {
                const streamChunk = chatItemCompRef.current.streamChunk;
                const chatItemStreamingBuffer = chatItemsStreamingBuffer.get(chatItemId) ?? [];
                chatItemStreamingBuffer.forEach((bufferedChunk) => {
                    streamChunk(bufferedChunk);
                });

                chatItemsStreamingBuffer.delete(chatItemId);
                streamChunk(chunk);
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

                let contentToUse: AiMsg[] | ReactNode | undefined = chatItem.content;
                let contentType: 'text' | 'server-component' = 'text';

                if (typeof contentToUse === 'function') {
                    const functionRef = serverComponentsFunctionsRef.current.get(chatItem.uid);
                    const serverComponentRef = serverComponentsRef.current.get(chatItem.uid);

                    if (functionRef && serverComponentRef) {
                        contentToUse = serverComponentRef;
                        contentType = 'server-component';
                    } else {
                        serverComponentsRef.current.delete(chatItem.uid);
                        serverComponentsFunctionsRef.current.delete(chatItem.uid);

                        try {
                            const ContentToUseFC = contentToUse as FunctionComponent;
                            contentToUse = <ContentToUseFC/>;

                            if (!contentToUse || !React.isValidElement(contentToUse)) {
                                throw new Error(`Invalid React element returned from the AI chat content function.`);
                            } else {
                                contentType = 'server-component';
                                serverComponentsRef.current.set(chatItem.uid, contentToUse as StreamedServerComponent);
                                serverComponentsFunctionsRef.current.set(chatItem.uid, ContentToUseFC);
                            }
                        } catch (_error) {
                            warn(
                                `The type of the AI chat content is an invalid function.\n` +
                                `If you're looking to render a React Server Components, please refer to ` +
                                `docs.nlkit.com/nlux for more information.\n`,
                            );

                            return null;
                        }
                    }
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

                    if (!isPrimitiveReactNodeType(contentToUse)) {
                        warnOnce(
                            `User chat item should have primitive content (string, number, boolean, null) — ` +
                            `Current content: ${JSON.stringify(contentToUse)} — ` +
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
                            contentType={contentType}
                            layout={props.layout}
                            messageOptions={props.messageOptions}
                            dataTransferMode={'batch'} // User chat items are always in batch mode.
                            fetchedContent={chatItem.content as AiMsg} // Same comp is used for user and AI chat items.
                            name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                            avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                            markdownContainersController={props.markdownContainersController}
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
                                    status={chatItem.status}
                                    direction={'received'}
                                    contentType={contentType}
                                    layout={props.layout}
                                    messageOptions={props.messageOptions}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    streamedContent={contentToUse as AiMsg[]}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    markdownContainersController={props.markdownContainersController}
                                />
                            );
                        } else {
                            //
                            // When the AI chat item is in complete state and the data transfer mode is fetch,
                            // we render the message content. We also check if the content is primitive and if a custom
                            // renderer is provided.
                            //
                            if (contentType === 'text' && !isPrimitiveReactNodeType(contentToUse) && !props.messageOptions?.responseRenderer) {
                                warn(
                                    `When the type of the AI chat content is not primitive (object or array), ` +
                                    `a custom renderer must be provided — ` +
                                    `Current content: ${JSON.stringify(contentToUse)} — ` +
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
                                    messageOptions={props.messageOptions}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    fetchedContent={contentToUse as AiMsg}
                                    contentType={contentType}
                                    fetchedServerResponse={chatItem.serverResponse}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    markdownContainersController={props.markdownContainersController}
                                />
                            );
                        }
                    } else {
                        //
                        // AI chat item in streaming state.
                        // No need for custom renderer here.
                        //
                        if (chatItem.status === 'streaming') {
                            const fetchedContent = (contentType === 'server-component' && isValidElement(contentToUse)) ? contentToUse : undefined;
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'streaming'}
                                    direction={'received'}
                                    contentType={contentType}
                                    fetchedContent={fetchedContent}
                                    layout={props.layout}
                                    messageOptions={props.messageOptions}
                                    dataTransferMode={chatItem.dataTransferMode}
                                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    markdownContainersController={props.markdownContainersController}
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
            {Loader}
        </div>
    );
};
