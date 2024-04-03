import {ChatAdapter, ChatAdapterExtras, ConversationPart, PromptBoxStatus, submitPrompt} from '@nlux/core';
import React, {ReactElement, useCallback, useEffect, useMemo, useRef} from 'react';
import {ConversationComp} from '../comp/Conversation/ConversationComp';
import {ConversationMessage} from '../comp/Conversation/props';
import {useInitialMessagesOnce} from '../comp/Conversation/utils/useInitialMessagesOnce';
import {PromptBoxComp} from '../comp/PromptBox/PromptBoxComp';
import {AiChatComponentProps} from './props';

export const AiChat: <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
) => ReactElement = (
    props,
    t,
) => {
    type MT = typeof t;
    const className = `nlux_root` + (props.className ? ` ${props.className}` : '');

    const initialMessages = useInitialMessagesOnce<MT>(props.initialConversation);
    const [prompt, setPrompt] = React.useState('');
    const [promptBoxStatus, setPromptBoxStatus] = React.useState<PromptBoxStatus>('typing');
    const [parts, setParts] = React.useState<ConversationPart<MT>[]>([]); // [ConversationPart<MT>
    const setPartsRef = useRef({parts, setParts   });
    const [messages, setMessages] = React.useState<ConversationMessage<MT>[]>(initialMessages ?? []);

    const adapterExtras: ChatAdapterExtras = useMemo(() => ({aiChatProps: props as any}), [props]);
    const canSubmit = useMemo(() => prompt.length > 0, [prompt]);
    const customAiMessageComponent = useMemo(() => props.customMessageComponent, []);
    const adapterToUse = useMemo<ChatAdapter>(() => {
        const adapterAsAny = props.adapter as any;
        return (typeof adapterAsAny?.create === 'function') ? adapterAsAny.create() : adapterAsAny;
    }, [props.adapter]);

    const handlePromptChange = useCallback((value: string) => setPrompt(value), []);
    const handlePromptFocus = useCallback(() => { /* TODO - Focus-specific logic */ }, []);
    const handleSubmitClick = useCallback(() => {
        const conversationPart: ConversationPart<any> = submitPrompt(prompt, adapterToUse, adapterExtras, 'fetch');
        if (conversationPart.status !== 'error') {

            // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
            // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
            // The actual conversation part was already updated outside of React rendering cycle,
            // but in order to trigger a check and potentially re-render the React component,
            // we need to change the reference of the parts array by creating a new array.

            conversationPart.on('complete', () => {
                const parts = setPartsRef.current.parts;
                setPartsRef.current.setParts([...parts]);
            });

            conversationPart.on('update', () => {
                const parts = setPartsRef.current.parts;
                setPartsRef.current.setParts([...parts]);
            });

            setParts([...parts, conversationPart]);
        }
    }, [prompt, adapterToUse, setPartsRef]);

    useEffect(() => {
        setPartsRef.current = {parts, setParts};
    }, [parts, setParts]);

    useEffect(() => {
        const newMessages: ConversationMessage<MT>[] = [];
        for (const conversationPart of parts) {
            if (conversationPart.status === 'error') {
                continue;
            }

            conversationPart.messages.forEach((partMessage) => {
                if (partMessage.participantRole === 'user') {
                    newMessages.push({
                        role: 'user',
                        message: partMessage.content,
                        id: partMessage.uid,
                    });
                } else {
                    if (partMessage.content !== undefined) {
                        newMessages.push({
                            role: 'ai',
                            message: partMessage.content,
                            id: partMessage.uid,
                        });
                    }
                }
            });
        }

        setMessages([
            ...(initialMessages ?? []),
            ...newMessages,
        ]);
    }, [initialMessages, parts]);

    return (
        <div className={className}>
            <ConversationComp
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
                onFocus={handlePromptFocus}
                onSubmit={handleSubmitClick}
            />
        </div>
    );
};
