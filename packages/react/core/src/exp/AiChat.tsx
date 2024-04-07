import {ChatAdapterExtras, ChatSegment, PromptBoxStatus, submitPrompt, warn} from '@nlux/core';
import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ConversationComp} from '../comp/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../comp/Conversation/props';
import {PromptBoxComp} from '../comp/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {chatItemsToChatSegment} from '../utils/chatItemsToChatSegment';
import {reactPropsToCoreProps} from '../utils/reactPropsToCoreProps';
import {AiChatComponentProps} from './props';

export const AiChat: <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
) => ReactElement = (
    props,
    t,
) => {
    type MessageType = typeof t;
    const className = `nlux_root` + (props.className ? ` ${props.className}` : '');
    const conversationRef = useRef<ImperativeConversationCompProps>(null);

    const [prompt, setPrompt] = useState('');
    const [promptBoxStatus, setPromptBoxStatus] = useState<PromptBoxStatus>('typing');
    const [initialSegment, setInitialSegment] = useState<ChatSegment<MessageType>>();
    const [chatSegments, setChatSegments] = useState<ChatSegment<MessageType>[]>([]);
    const setSegmentsRef = useRef({chatSegments, setChatSegments});

    const adapterToUse = useMemo(() => adapterParamToUsableAdapter(props.adapter), [props.adapter]);
    const adapterExtras: ChatAdapterExtras | undefined = useMemo(() => {
        if (adapterToUse) {
            return {aiChatProps: reactPropsToCoreProps(props, adapterToUse)};
        }
    }, [props, adapterToUse]);

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const customAiMessageComponent = useMemo(() => props.customMessageComponent, []);

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitClick = useCallback(() => {
        if (!adapterToUse || !adapterExtras) {
            warn('No valid adapter was provided to AiChat component');
            return;
        }

        const chatSegment: ChatSegment<MessageType> = submitPrompt(
            prompt,
            adapterToUse,
            adapterExtras,
            'stream',
        );

        if (chatSegment.status === 'error') {
            warn('Error occurred while submitting prompt');
            // TODO — Display error message to user
            return;
        }

        // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
        // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
        // On 'complete' and 'update' events, the chat segment is updated, but in order
        // to trigger a check and potentially re-render the React component, we need to change
        // the reference of the parts array by creating a new array.

        chatSegment.on('complete', () => {
            const segments = setSegmentsRef.current.chatSegments;
            setSegmentsRef.current.setChatSegments([...segments]);
        });

        chatSegment.on('update', (newChatSegment: ChatSegment<MessageType>) => {
            const currentChatSegments = setSegmentsRef.current.chatSegments;
            const newChatSegments: ChatSegment<MessageType>[] = currentChatSegments.map(
                (currentChatSegment) => {
                    if (currentChatSegment.uid === newChatSegment.uid) {
                        return newChatSegment;
                    }

                    return currentChatSegment;
                },
            );

            setSegmentsRef.current.setChatSegments(newChatSegments);
        });

        chatSegment.on('error', () => {
            const parts = setSegmentsRef.current.chatSegments;
            const newParts = parts.filter((part) => part.uid !== chatSegment.uid);
            setSegmentsRef.current.setChatSegments(newParts);
        });

        chatSegment.on('chunk', (messageId: string, chunk: string) => {
            conversationRef.current?.streamChunk(chatSegment.uid, messageId, chunk);
        });

        setChatSegments([...chatSegments, chatSegment]);
        setPrompt('');

    }, [chatSegments, prompt, adapterToUse, adapterExtras, setSegmentsRef]);

    useEffect(() => {
        setSegmentsRef.current = {chatSegments, setChatSegments};
    }, [chatSegments, setChatSegments]);

    useEffect(() => {
        setInitialSegment(
            props.initialConversation
                ? chatItemsToChatSegment(props.initialConversation)
                : undefined,
        );
    }, [props.initialConversation]);

    const conversationSegments = useMemo(() => {
        return initialSegment ? [initialSegment, ...chatSegments] : chatSegments;
    }, [initialSegment, chatSegments]);

    const ForwardConversationComp = forwardRef(
        ConversationComp<MessageType>,
    );

    return (
        <div className={className}>
            <ForwardConversationComp
                ref={conversationRef}
                segments={conversationSegments}
                conversationOptions={props.conversationOptions}
                personaOptions={props.personaOptions}
                customRenderer={customAiMessageComponent}
                syntaxHighlighter={props.syntaxHighlighter}
            />
            <PromptBoxComp
                status={promptBoxStatus}
                prompt={prompt}
                hasValidInput={hasValidInput}
                placeholder={props.promptBoxOptions?.placeholder}
                onChange={handlePromptChange}
                onSubmit={handleSubmitClick}
            />
        </div>
    );
};
