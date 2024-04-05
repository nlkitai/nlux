import {chatSegmentsToMessages} from '@nlux-dev/core/src/utils/chat/chatSegmentsToMessages';
import {reactPropsToCoreProps} from '@nlux-dev/core/src/utils/chat/reactPropsToCoreProps';
import {ChatAdapterExtras, ChatSegment, PromptBoxStatus, submitPrompt, warn} from '@nlux/core';
import React, {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ConversationComp} from '../comp/Conversation/ConversationComp';
import {ConversationMessage, ImperativeConversationCompProps} from '../comp/Conversation/props';
import {useInitialMessagesOnce} from '../comp/Conversation/utils/useInitialMessagesOnce';
import {PromptBoxComp} from '../comp/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
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

    const initialMessages = useInitialMessagesOnce<MessageType>(props.initialConversation);
    const [messages, setMessages] = useState<ConversationMessage<MessageType>[]>(initialMessages ?? []);
    const [prompt, setPrompt] = useState('');
    const [promptBoxStatus, setPromptBoxStatus] = useState<PromptBoxStatus>('typing');
    const [parts, setParts] = useState<ChatSegment<MessageType>[]>([]); // [ChatSegment<MT>
    const setPartsRef = useRef({parts, setParts});

    const adapterToUse = useMemo(() => adapterParamToUsableAdapter(props.adapter), [props.adapter]);
    const adapterExtras: ChatAdapterExtras | undefined = useMemo(() => {
        if (adapterToUse) {
            return {aiChatProps: reactPropsToCoreProps(props, adapterToUse)};
        }
    }, [props, adapterToUse]);

    const canSubmit = useMemo(() => prompt.length > 0, [prompt]);
    const customAiMessageComponent = useMemo(() => props.customMessageComponent, []);

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitClick = useCallback(() => {
        if (!adapterToUse || !adapterExtras) {
            warn('No valid adapter was provided to AiChat component');
            return;
        }

        const chatSegment: ChatSegment<any> = submitPrompt(
            prompt,
            adapterToUse,
            adapterExtras,
            'stream',
        );

        if (chatSegment.status === 'error') {
            // TODO - Handle error
            return;
        }

        // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
        // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
        // On 'complete' and 'update' events, the chat segment is updated, but in order
        // to trigger a check and potentially re-render the React component, we need to change
        // the reference of the parts array by creating a new array.

        chatSegment.on('complete', () => {
            const parts = setPartsRef.current.parts;
            setPartsRef.current.setParts([...parts]);
        });

        chatSegment.on('update', () => {
            const parts = setPartsRef.current.parts;
            setPartsRef.current.setParts([...parts]);
        });

        chatSegment.on('error', () => {
            const parts = setPartsRef.current.parts;
            const newParts = parts.filter((part) => part.uid !== chatSegment.uid);
            setPartsRef.current.setParts(newParts);
        });

        chatSegment.on('chunk', (messageId: string, chunk: string) => {
            conversationRef.current?.streamChunk(messageId, chunk);
        });

        setParts([...parts, chatSegment]);
        setPrompt('');

    }, [parts, prompt, adapterToUse, adapterExtras, setPartsRef]);

    useEffect(() => {
        setPartsRef.current = {parts, setParts};
    }, [parts, setParts]);

    useEffect(() => {
        setMessages([
            ...(initialMessages ?? []),
            ...chatSegmentsToMessages(parts),
        ]);
    }, [initialMessages, parts]);

    const ForwardConversationComp = forwardRef(
        ConversationComp<MessageType>,
    );

    return (
        <div className={className}>
            <ForwardConversationComp
                ref={conversationRef}
                messages={messages}
                conversationOptions={props.conversationOptions}
                personaOptions={props.personaOptions}
                customAiMessageComponent={customAiMessageComponent}
                syntaxHighlighter={props.syntaxHighlighter}
            />
            <PromptBoxComp
                status={promptBoxStatus}
                prompt={prompt}
                canSubmit={canSubmit}
                placeholder={props.promptBoxOptions?.placeholder}
                onChange={handlePromptChange}
                onSubmit={handleSubmitClick}
            />
        </div>
    );
};
