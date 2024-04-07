import {createRef, forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useMemo} from 'react';
import {ChatItemComp} from '../../ui/ChatItem/ChatItemComp';
import {ChatItemImperativeProps} from '../../ui/ChatItem/props';
import {ChatSegmentImperativeProps, ChatSegmentProps} from './props';
import {nameFromMessageAndPersona} from './utils/nameFromMessageAndPersona';
import {pictureFromMessageAndPersona} from './utils/pictureFromMessageAndPersona';

export const ChatSegmentComp: <MessageType>(
    props: ChatSegmentProps<MessageType>,
    ref: Ref<ChatSegmentImperativeProps<MessageType>>,
) => ReactNode = (
    props,
    ref,
) => {
    const chatItemsRef = useMemo(
        () => new Map<string, RefObject<ChatItemImperativeProps>>(), [],
    );

    useEffect(() => {
        if (props.chatSegment.items.length === 0) {
            chatItemsRef.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatItemsRef.keys());
        const itemsInSegments = new Set<string>(props.chatSegment.items.map((item) => item.uid));
        for (const itemInRefsMap of itemsInRefsMap) {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatItemsRef.delete(itemInRefsMap);
            }
        }
    }, [props.chatSegment.items]);

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            // TODO - Implement scroll to bottom
        },
        streamChunk: (messageId: string, chunk: string) => {
            const messageCompRef = chatItemsRef.get(messageId);
            if (messageCompRef?.current) {
                messageCompRef.current.streamChunk(chunk);
            }
        },
    }), []);

    const chatItems = props.chatSegment.items;
    if (chatItems.length === 0) {
        return null;
    }

    return (
        <>
            {chatItems.map((chatItem) => {
                let ref: RefObject<ChatItemImperativeProps> | undefined = chatItemsRef.get(chatItem.uid);
                if (!ref) {
                    ref = createRef<ChatItemImperativeProps>();
                    chatItemsRef.set(chatItem.uid, ref);
                }

                const ForwardRefChatItemComp = forwardRef(
                    ChatItemComp,
                );

                if (chatItem.participantRole === 'user') {
                    if (chatItem.status !== 'complete') {
                        return null;
                    }

                    return (
                        <ForwardRefChatItemComp
                            ref={ref}
                            key={chatItem.uid}
                            uid={chatItem.uid}
                            status={'rendered'}
                            direction={'outgoing'}
                            message={chatItem.content}
                            customRenderer={props.customRenderer}
                            name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                            picture={pictureFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                        />
                    );
                } else {
                    if (chatItem.status === 'complete') {
                        if (chatItem.dataTransferMode === 'stream') {
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'rendered'}
                                    direction={'incoming'}
                                    customRenderer={props.customRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                />
                            );
                        } else {
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={'rendered'}
                                    direction={'incoming'}
                                    message={chatItem.content}
                                    customRenderer={props.customRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                />
                            );
                        }
                    } else {
                        if (chatItem.status === 'loading' || chatItem.status === 'streaming') {
                            return (
                                <ForwardRefChatItemComp
                                    ref={ref}
                                    key={chatItem.uid}
                                    uid={chatItem.uid}
                                    status={chatItem.status as 'loading' | 'streaming'}
                                    direction={'incoming'}
                                    loader={props.loader}
                                    customRenderer={props.customRenderer}
                                    name={nameFromMessageAndPersona(chatItem.participantRole, props.personaOptions)}
                                    picture={pictureFromMessageAndPersona(chatItem.participantRole,
                                        props.personaOptions,
                                    )}
                                />
                            );
                        }
                    }

                    return null;
                }
            })}
        </>
    );
};
