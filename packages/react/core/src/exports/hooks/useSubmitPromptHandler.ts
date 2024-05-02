import {PromptBoxOptions} from '@nlux/core';
import {MutableRefObject, useCallback, useEffect, useMemo, useRef} from 'react';
import {submitPrompt} from '../../../../../shared/src/services/submitPrompt/submitPromptImpl';
import {ChatAdapter} from '../../../../../shared/src/types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../../shared/src/types/adapters/chat/chatAdapterExtras';
import {StandardChatAdapter} from '../../../../../shared/src/types/adapters/chat/standardChatAdapter';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '../../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {ChatSegmentUserMessage} from '../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {PromptBoxStatus} from '../../../../../shared/src/ui/PromptBox/props';
import {warn} from '../../../../../shared/src/utils/warn';
import {ImperativeConversationCompProps} from '../../logic/Conversation/props';

type SubmitPromptHandlerProps<AiMsg> = {
    adapterToUse?: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    adapterExtras?: ChatAdapterExtras<AiMsg>;
    prompt: string;
    promptBoxOptions?: PromptBoxOptions;
    chatSegments: ChatSegment<AiMsg>[];
    showException: (message: string) => void;
    setChatSegments: (segments: ChatSegment<AiMsg>[]) => void;
    setPromptBoxStatus: (status: PromptBoxStatus) => void;
    setPrompt: (prompt: string) => void;
    conversationRef: MutableRefObject<ImperativeConversationCompProps | null>
};

export const useSubmitPromptHandler = <AiMsg>(props: SubmitPromptHandlerProps<AiMsg>) => {
    const {
        adapterToUse,
        adapterExtras,
        prompt: promptTyped,
        promptBoxOptions,
        showException,
        chatSegments,
        setChatSegments,
        setPromptBoxStatus,
        setPrompt,
        conversationRef,
    } = props;

    const hasValidInput = useMemo(() => promptTyped.length > 0, [promptTyped]);

    // The prompt typed will be read by the submitPrompt function, but it will not be used as a
    // dependency for the submitPrompt function (only the promptToSubmit is a dependency to useCallback).
    // Hence, the use of useRef to store the value and access it within the submitPrompt function, without
    // causing the memoized function to be re-created.
    const promptTypedRef = useRef(promptTyped);
    promptTypedRef.current = promptTyped;

    // React functions and state that can be accessed by non-React DOM update code
    const domToReactRef = useRef({
        chatSegments,
        setChatSegments,
        setPromptBoxStatus,
        showException,
        setPrompt,
    });

    useEffect(() => {
        domToReactRef.current = {
            chatSegments,
            setChatSegments,
            setPromptBoxStatus,
            showException,
            setPrompt,
        };
    }, [chatSegments, setChatSegments, setPromptBoxStatus, showException, setPrompt]);

    return useCallback(
        () => {
            if (!adapterToUse || !adapterExtras) {
                warn('No valid adapter was provided to AiChat component');
                return;
            }

            if (!hasValidInput) {
                return;
            }

            if (promptBoxOptions?.disableSubmitButton) {
                return;
            }

            setPromptBoxStatus('submitting');
            const promptToSubmit = promptTyped;
            const streamedMessageIds: Set<string> = new Set();

            const {
                segment: chatSegment,
                observable: chatSegmentObservable,
            } = submitPrompt<AiMsg>(
                promptToSubmit,
                adapterToUse,
                adapterExtras,
            );

            if (chatSegment.status === 'error') {
                warn('Error occurred while submitting prompt');
                showException('Error occurred while submitting prompt');
                setPromptBoxStatus('typing');

                // Reset the prompt if the prompt box is empty
                if (promptTypedRef.current === '') {
                    setPrompt(promptToSubmit);
                }
                return;
            }

            // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
            // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
            // On 'complete' and 'update' events, the chat segment is updated, but in order
            // to trigger a check and potentially re-render the React component, we need to change
            // the reference of the parts array by creating a new array.

            const handleSegmentItemReceived = (item: ChatSegmentAiMessage<AiMsg> | ChatSegmentUserMessage) => {
                const currentChatSegments = domToReactRef.current.chatSegments;
                const newChatSegments: ChatSegment<AiMsg>[] = currentChatSegments.map(
                    (currentChatSegment) => {
                        if (currentChatSegment.uid !== chatSegmentObservable.segmentId) {
                            return currentChatSegment;
                        }

                        return {
                            ...currentChatSegment,
                            items: [
                                ...currentChatSegment.items,
                                {...item},
                            ],
                        };
                    },
                );

                domToReactRef.current.setChatSegments(newChatSegments);
            };

            chatSegmentObservable.on('userMessageReceived', (userMessage) => {
                handleSegmentItemReceived(userMessage);
            });

            chatSegmentObservable.on('aiMessageStreamStarted', (aiStreamedMessage) => {
                handleSegmentItemReceived(aiStreamedMessage);
                domToReactRef.current.setPromptBoxStatus('waiting');
                if (promptTypedRef.current === promptToSubmit) {
                    domToReactRef.current.setPrompt('');
                }

                streamedMessageIds.add(aiStreamedMessage.uid);
            });

            chatSegmentObservable.on('aiMessageReceived', (aiMessage) => {
                const currentChatSegments = domToReactRef.current.chatSegments;
                const newChatSegments: ChatSegment<AiMsg>[] = currentChatSegments.map(
                    (currentChatSegment) => {
                        if (currentChatSegment.uid !== chatSegmentObservable.segmentId) {
                            return currentChatSegment;
                        }

                        return {...currentChatSegment, items: [...currentChatSegment.items, {...aiMessage}]};
                    },
                );

                domToReactRef.current.setChatSegments(newChatSegments);
            });

            chatSegmentObservable.on('complete', (completeChatSegment) => {
                domToReactRef.current.setPromptBoxStatus('typing');
                const currentChatSegments = domToReactRef.current.chatSegments;
                const newChatSegments: ChatSegment<AiMsg>[] = currentChatSegments.map(
                    (currentChatSegment) => {
                        if (currentChatSegment.uid !== chatSegmentObservable.segmentId) {
                            return currentChatSegment;
                        }

                        return {...completeChatSegment};
                    },
                );

                domToReactRef.current.setChatSegments(newChatSegments);
                if (promptTypedRef.current === promptToSubmit) {
                    setPrompt('');
                }

                if (streamedMessageIds.size > 0) {
                    streamedMessageIds.forEach((messageId) => {
                        conversationRef.current?.completeStream(chatSegmentObservable.segmentId, messageId);
                    });

                    streamedMessageIds.clear();
                }
            });

            chatSegmentObservable.on('aiChunkReceived', (chunk: string, messageId: string) => {
                requestAnimationFrame(() => {
                    // We need to wait a bit before streaming the chunk to the chat item
                    // because of the React lifecycle. The chat item might not be rendered yet.
                    conversationRef.current?.streamChunk(chatSegment.uid, messageId, chunk);
                });
            });

            chatSegmentObservable.on('error', (exception) => {
                const parts = domToReactRef.current.chatSegments;
                const newParts = parts.filter((part) => part.uid !== chatSegment.uid);

                domToReactRef.current.setChatSegments(newParts);
                domToReactRef.current.setPromptBoxStatus('typing');
                domToReactRef.current.showException(exception);

                if (promptTypedRef.current === '') {
                    setPrompt(promptToSubmit);
                }
            });

            domToReactRef.current.setChatSegments([
                ...domToReactRef.current.chatSegments,
                chatSegment,
            ]);
        },
        [
            promptTyped,
            adapterToUse,
            adapterExtras,
            showException,
            domToReactRef,
            promptBoxOptions?.disableSubmitButton,
        ],
    );
};
