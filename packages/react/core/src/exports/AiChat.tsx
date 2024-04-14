import {createExceptionBoxController} from '@nlux-dev/core/src/ui/ExceptionsBox/control';
import {
    ChatAdapterExtras,
    ChatSegment,
    compExceptionsBoxClassName,
    getRootClassNames,
    PromptBoxStatus,
    submitPrompt,
    warn,
} from '@nlux/core';
import {CSSProperties, forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ConversationComp} from '../logic/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../logic/Conversation/props';
import {PromptBoxComp} from '../ui/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {chatItemsToChatSegment} from '../utils/chatItemsToChatSegment';
import {reactPropsToCoreProps} from '../utils/reactPropsToCoreProps';
import {AiChatComponentProps} from './props';

export const AiChat: <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
) => ReactElement = function <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
): ReactElement {
    const conversationRef = useRef<ImperativeConversationCompProps>(null);
    const exceptionBoxRef = useRef<HTMLDivElement>(null);

    const exceptionBoxController = useMemo(() => {
        return exceptionBoxRef.current ? createExceptionBoxController(exceptionBoxRef.current) : undefined;
    }, [exceptionBoxRef.current]);

    const showException = useCallback((message: string) => {
        exceptionBoxController?.displayException(message);
    }, [exceptionBoxController]);

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

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitClick = useCallback(() => {
            if (!adapterToUse || !adapterExtras) {
                warn('No valid adapter was provided to AiChat component');
                return;
            }

            if (!hasValidInput) {
                return;
            }

            if (props.promptBoxOptions?.disableSubmitButton) {
                return;
            }

            const chatSegment: ChatSegment<MessageType> = submitPrompt(
                prompt,
                adapterToUse,
                adapterExtras,
            );

            if (chatSegment.status === 'error') {
                warn('Error occurred while submitting prompt');
                showException('Error occurred while submitting prompt');
                return;
            }

            // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
            // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
            // On 'complete' and 'update' events, the chat segment is updated, but in order
            // to trigger a check and potentially re-render the React component, we need to change
            // the reference of the parts array by creating a new array.

            chatSegment.on('complete', (newChatSegment) => {
                const segments = setSegmentsRef.current.chatSegments.map((segment) => {
                    if (segment.uid === chatSegment.uid) {
                        return newChatSegment;
                    }

                    return segment;
                });

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
                showException('Error occurred while processing prompt');
            });

            chatSegment.on('chunk', (messageId: string, chunk: string) => {
                conversationRef.current?.streamChunk(chatSegment.uid, messageId, chunk);
            });

            setChatSegments([...chatSegments, chatSegment]);
            setPrompt('');

        },
        [
            showException,
            chatSegments,
            prompt,
            adapterToUse,
            adapterExtras,
            setSegmentsRef,
            props.promptBoxOptions?.disableSubmitButton,
        ],
    );

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

    const rootClassNames = getRootClassNames({
        className: props.className,
        themeId: props.themeId,
    }).join(' ');

    const style: CSSProperties = useMemo(() => {
        const result: CSSProperties = {
            minWidth: '280px',
            minHeight: '280px',
        };

        if (props.layoutOptions?.width) {
            result.width = props.layoutOptions.width;
        }

        if (props.layoutOptions?.height) {
            result.height = props.layoutOptions.height;
        }

        return result;
    }, [props.layoutOptions?.width, props.layoutOptions?.height]);

    return (
        <div className={rootClassNames} style={style}>
            <div className={compExceptionsBoxClassName} ref={exceptionBoxRef}/>
            <div className="nlux-chtRm-cntr">
                <div className="nlux-chtRm-cnv-cntr">
                    <ForwardConversationComp
                        ref={conversationRef}
                        segments={conversationSegments}
                        conversationOptions={props.conversationOptions}
                        personaOptions={props.personaOptions}
                        customRenderer={props.aiMessageComponent}
                        syntaxHighlighter={props.syntaxHighlighter}
                    />
                </div>
                <div className="nlux-chtRm-prmptBox-cntr">
                    <PromptBoxComp
                        status={promptBoxStatus}
                        prompt={prompt}
                        hasValidInput={hasValidInput}
                        placeholder={props.promptBoxOptions?.placeholder}
                        autoFocus={props.promptBoxOptions?.autoFocus}
                        submitShortcut={props.promptBoxOptions?.submitShortcut}
                        onChange={handlePromptChange}
                        onSubmit={handleSubmitClick}
                    />
                </div>
            </div>
        </div>
    );
};
