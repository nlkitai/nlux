import {ChatSegment, ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import React, {
    ReactNode,
    FunctionComponent,
    Ref,
    RefObject,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    createRef,
    forwardRef,
    isValidElement,
    useCallback, ForwardRefExoticComponent, RefAttributes,
} from 'react';
import {AiBatchedMessage} from '@shared/types/chatSegment/chatSegmentAiMessage';
import {getChatSegmentClassName} from '@shared/utils/dom/getChatSegmentClassName';
import {warn, warnOnce} from '@shared/utils/warn';
import {ChatItemComp} from '../ChatItem/ChatItemComp';
import {ChatItemImperativeProps, ChatItemProps} from '../ChatItem/props';
import {ChatSegmentImperativeProps, ChatSegmentProps} from './props';
import {useItemsRefs} from './useItemsRefs';
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
        () => new Map<string, RefObject<ChatItemImperativeProps<AiMsg>>>(), []);

    const chatItemsStreamingBuffer = useMemo(() => new Map<string, Array<AiMsg>>(), []);
    const serverComponentsRef = useRef<Map<string, ReactNode | StreamedServerComponent>>(new Map());
    const serverComponentsFunctionsRef = useRef<Map<string, FunctionComponent>>(new Map<string, FunctionComponent>());

    // Updates server component and chat item refs, and server component functions refs
    // when the chat segment items change.
    useItemsRefs(chatSegment.items, serverComponentsRef, serverComponentsFunctionsRef, chatItemsRef);

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
        cancelStreams: () => {
            chatItemsStreamingBuffer.clear();
            chatItemsRef.forEach((ref) => {
                ref.current?.cancelStream();
            });
        }
    }), [
        // setCompleteOnInitialRender is not needed as a dependency here, even though it is used inside.
    ]);

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

    const Loader = useMemo(() => {
        if (chatSegment.status !== 'active') {
            return null;
        }

        return (<div className={'nlux-chatSegment-loader-container'}>{props.Loader}</div>);
    }, [chatSegment.status, props.Loader]);

    const ForwardRefChatItemComp = useMemo(() => forwardRef(ChatItemComp<AiMsg>), []);

    const onMarkdownStreamRendered = useCallback((chatItemId: string) => {
        props.onMarkdownStreamRendered?.(chatSegment.uid, chatItemId);
    }, []);

    if (chatSegment.items.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className={getChatSegmentClassName(chatSegment.status)}>
            {chatSegment.items.map((chatItem) => chatItemToReactNode(
                props,
                ForwardRefChatItemComp,
                chatSegment,
                chatItem,
                chatItemsRef,
                serverComponentsFunctionsRef,
                serverComponentsRef,
                onMarkdownStreamRendered,
            ))}
            {Loader}
        </div>
    );
};

//
// IMPORTANT: The function below is to convert a chat item to a React node.
//
const chatItemToReactNode = function <AiMsg>(
    props: ChatSegmentProps<AiMsg>,
    ForwardRefChatItemComp: ForwardRefExoticComponent<ChatItemProps<AiMsg> & RefAttributes<ChatItemImperativeProps<AiMsg>>>,
    chatSegment: ChatSegment<AiMsg>,
    chatItem: ChatSegmentItem<AiMsg>,
    chatItemsRef: Map<string, RefObject<ChatItemImperativeProps<AiMsg>>>,
    serverComponentsFunctionsRef: React.MutableRefObject<Map<string, FunctionComponent>>,
    serverComponentsRef: React.MutableRefObject<Map<string, ReactNode | StreamedServerComponent>>,
    onMarkdownStreamRendered: (chatItemId: string) => void,
): ReactNode {

    const isPartOfInitialSegment = props.isInitialSegment;
    let ref: RefObject<ChatItemImperativeProps<AiMsg>> | undefined = chatItemsRef.get(chatItem.uid);
    if (!ref) {
        ref = createRef<ChatItemImperativeProps<AiMsg>>();
        chatItemsRef.set(chatItem.uid, ref);
    }

    //
    // 2 key variables that are used to store the content to render in the chat item component:
    // - contentToUse: The content to be used in the chat item component.
    // - contentType: The type of the content to be used in the chat item component.
    //
    let contentToUse: AiMsg[] | ReactNode | StreamedServerComponent | undefined = (chatItem as { content?: Array<AiMsg> }).content;
    let contentType: 'text' | 'server-component' = 'text';

    //
    // If the content is a function, we render it as a React component (Use case: React Server Component adapter).
    // Here are attempting to resolve the server component function to a React element.
    // We handle the case where the function is not a valid React element in the try/catch block.
    //
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
                    serverComponentsRef.current.set(chatItem.uid, contentToUse);
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

    //
    // Handling user messages, that are always expected to be in complete state.
    //
    if (chatItem.participantRole === 'user') {

        // User chat item — That should always be in complete state.
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
                dataTransferMode={'batch'} // User chat items are always in batch mode.

                fetchedContent={chatItem.content as AiMsg} // Same comp is used for user and AI chat items.
                markdownContainersController={props.markdownContainersController}

                // Options required for rendering the chat item.
                layout={props.layout}
                messageOptions={props.messageOptions}
                isPartOfInitialSegment={isPartOfInitialSegment}
                name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}

                // Using to edit and re-submit user messages.
                submitShortcutKey={props.submitShortcutKey}
                onPromptResubmit={(newPrompt) => props.onPromptResubmit(props.chatSegment.uid, chatItem.uid, newPrompt)}
            />
        );
    }


    //
    // At this point, we are sure that the chat item is an AI chat item.
    // Below, we handle the assistant messages, that can be in complete or active state.
    //

    // AI chat item in complete state.
    if (chatItem.status === 'complete') {
        //
        // When the AI chat item is in complete state and the data transfer mode is stream,
        // we do not render the message content — as it is streamed.
        // We do not rely on custom renderer here since the content is streamed as string.
        //
        if (chatItem.dataTransferMode === 'stream') {
            return (
                <ForwardRefChatItemComp
                    ref={ref}
                    key={chatItem.uid}
                    uid={chatItem.uid}
                    status={chatItem.status}
                    direction={'received'}
                    contentType={contentType}
                    dataTransferMode={chatItem.dataTransferMode}

                    markdownContainersController={props.markdownContainersController}
                    onMarkdownStreamRendered={onMarkdownStreamRendered}
                    streamedContent={contentToUse as AiMsg[]}
                    streamedServerResponse={chatItem.serverResponse}
                    // fetchedContent not used in stream mode.
                    // fetchedServerResponse not used in stream mode.

                    // Options required for rendering the chat item.
                    layout={props.layout}
                    messageOptions={props.messageOptions}
                    isPartOfInitialSegment={isPartOfInitialSegment}
                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                />
            );
        } else {
            //
            // When the AI chat item is in complete state and the data transfer mode is batch,
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
                    contentType={contentType}
                    dataTransferMode={chatItem.dataTransferMode}

                    markdownContainersController={props.markdownContainersController}
                    onMarkdownStreamRendered={onMarkdownStreamRendered}

                    fetchedContent={contentToUse as AiMsg}
                    fetchedServerResponse={chatItem.serverResponse}
                    // streamedContent not used
                    // streamedServerResponse not used

                    // Options required for rendering the chat item.
                    layout={props.layout}
                    messageOptions={props.messageOptions}
                    isPartOfInitialSegment={isPartOfInitialSegment}
                    name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                    avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                />
            );
        }
    }

    //
    // AI chat item in streaming state.
    //
    if (chatItem.status === 'streaming') {

        // In the case of a server component, we render the server component content.
        // The server component will be rendered as a React component and its content will be streamed via React RSC API.
        const serverComponent = (contentType === 'server-component' && isValidElement(contentToUse))
            ? contentToUse // Server component content that is being streamed.
            : undefined;

        // When the content is not a React server component, the streaming will be handled via markdownContainersController.
        // which will stream the content as a string.

        return (
            <ForwardRefChatItemComp
                ref={ref}
                key={chatItem.uid}
                uid={chatItem.uid}
                status={'streaming'}
                direction={'received'}
                contentType={contentType}
                dataTransferMode={chatItem.dataTransferMode}

                markdownContainersController={props.markdownContainersController}
                onMarkdownStreamRendered={onMarkdownStreamRendered}

                fetchedContent={serverComponent}
                // fetchedServerResponse not used
                // streamedContent not used
                // streamedServerResponse not used

                // Options required for rendering the chat item.
                layout={props.layout}
                messageOptions={props.messageOptions}
                isPartOfInitialSegment={isPartOfInitialSegment}
                name={participantNameFromRoleAndPersona(chatItem.participantRole, props.personaOptions)}
                avatar={avatarFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
            />
        );
    }

    // We do render a chat item on 'loading' or 'error' states:
    // - On 'loading' state — A loading spinner will be displayed.
    // - On 'error' state — An error message will be shown.
}
