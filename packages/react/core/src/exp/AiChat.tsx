import {conversationPartsToMessages} from '@nlux-dev/core/src/utils/chat/conversationPartsToMessages';
import {reactPropsToCoreProps} from '@nlux-dev/core/src/utils/chat/reactPropsToCoreProps';
import {ChatAdapterExtras, ConversationPart, PromptBoxStatus, submitPrompt, warn} from '@nlux/core';
import React, {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef} from 'react';
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
    const [messages, setMessages] = React.useState<ConversationMessage<MessageType>[]>(initialMessages ?? []);
    const [prompt, setPrompt] = React.useState('');
    const [promptBoxStatus, setPromptBoxStatus] = React.useState<PromptBoxStatus>('typing');
    const [parts, setParts] = React.useState<ConversationPart<MessageType>[]>([]); // [ConversationPart<MT>
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

        const conversationPart: ConversationPart<any> = submitPrompt(
            prompt,
            adapterToUse,
            adapterExtras,
            'stream',
        );

        if (conversationPart.status === 'error') {
            // TODO - Handle error
            return;
        }

        // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
        // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
        // On 'complete' and 'update' events, the conversation part is updated, but in order
        // to trigger a check and potentially re-render the React component, we need to change
        // the reference of the parts array by creating a new array.

        conversationPart.on('complete', () => {
            const parts = setPartsRef.current.parts;
            setPartsRef.current.setParts([...parts]);
        });

        conversationPart.on('update', () => {
            const parts = setPartsRef.current.parts;
            setPartsRef.current.setParts([...parts]);
        });

        conversationPart.on('error', () => {
            const parts = setPartsRef.current.parts;
            const newParts = parts.filter((part) => part.uid !== conversationPart.uid);
            setPartsRef.current.setParts(newParts);
        });

        conversationPart.on('chunk', (messageId: string, chunk: string) => {
            conversationRef.current?.streamChunk(messageId, chunk);
        });

        setParts([...parts, conversationPart]);
        setPrompt('');

    }, [parts, prompt, adapterToUse, adapterExtras, setPartsRef]);

    useEffect(() => {
        setPartsRef.current = {parts, setParts};
    }, [parts, setParts]);

    useEffect(() => {
        setMessages([
            ...(initialMessages ?? []),
            ...conversationPartsToMessages(parts),
        ]);
    }, [initialMessages, parts]);

    const ForwardConversationComp = forwardRef(
        ConversationComp<MessageType>,
    );

    console.dir(messages);

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
