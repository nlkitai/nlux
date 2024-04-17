import {ChatAdapter, ChatAdapterExtras, PromptBoxOptions, StandardChatAdapter, submitPrompt} from '@nlux/core';
import {MutableRefObject, useCallback, useEffect, useMemo, useRef} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
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
    setPromptBoxStatus: (status: 'typing' | 'submitting') => void;
    conversationRef: MutableRefObject<ImperativeConversationCompProps | null>
};

export const useSubmitPromptHandler = <AiMsg>(props: SubmitPromptHandlerProps<AiMsg>) => {
    const {
        adapterToUse,
        adapterExtras,
        prompt,
        promptBoxOptions,
        showException,
        chatSegments,
        setChatSegments,
        setPromptBoxStatus,
        conversationRef,
    } = props;

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const domToReactRef = useRef({
        chatSegments,
        setChatSegments,
        setPromptBoxStatus,
        showException,
    });

    useEffect(() => {
        domToReactRef.current = {
            chatSegments,
            setChatSegments,
            setPromptBoxStatus,
            showException,
        };
    }, [chatSegments, setChatSegments, setPromptBoxStatus, showException]);

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
            const {
                segment: chatSegment,
                observable: chatSegmentObservable,
            } = submitPrompt<AiMsg>(
                prompt,
                adapterToUse,
                adapterExtras,
            );

            if (chatSegment.status === 'error') {
                warn('Error occurred while submitting prompt');
                showException('Error occurred while submitting prompt');
                setPromptBoxStatus('typing');
                return;
            }

            // THE FOLLOWING CODE IS USED TO TRIGGER AN UPDATE OF THE REACT STATE.
            // The 'on' event listeners are implemented by @nlux/core non-React prompt handler.
            // On 'complete' and 'update' events, the chat segment is updated, but in order
            // to trigger a check and potentially re-render the React component, we need to change
            // the reference of the parts array by creating a new array.

            chatSegmentObservable.on('complete', (newChatSegment) => {
                const segments = domToReactRef.current.chatSegments.map((segment) => {
                    if (segment.uid === chatSegment.uid) {
                        return newChatSegment;
                    }

                    return segment;
                });

                domToReactRef.current.setChatSegments([...segments]);
                domToReactRef.current.setPromptBoxStatus('typing');
            });

            // chatSegmentObservable.on('', (newChatSegment: ChatSegment<AiMsg>) => {
            //     const currentChatSegments = domToReactRef.current.chatSegments;
            //     const newChatSegments: ChatSegment<AiMsg>[] = currentChatSegments.map(
            //         (currentChatSegment) => {
            //             if (currentChatSegment.uid === newChatSegment.uid) {
            //                 return newChatSegment;
            //             }
            //
            //             return currentChatSegment;
            //         },
            //     );
            //
            //     domToReactRef.current.setChatSegments(newChatSegments);
            //     domToReactRef.current.setPromptBoxStatus('typing');
            // });

            chatSegmentObservable.on('error', (exception) => {
                const parts = domToReactRef.current.chatSegments;
                const newParts = parts.filter((part) => part.uid !== chatSegment.uid);

                domToReactRef.current.setChatSegments(newParts);
                domToReactRef.current.setPromptBoxStatus('typing');
                domToReactRef.current.showException(exception);
            });

            chatSegmentObservable.on('aiChunkReceived', (messageId: string, chunk: string) => {
                conversationRef.current?.streamChunk(chatSegment.uid, messageId, chunk);
            });

            domToReactRef.current.setChatSegments([
                ...domToReactRef.current.chatSegments,
                chatSegment,
            ]);
        },
        [
            showException,
            domToReactRef,
            prompt,
            adapterToUse,
            adapterExtras,
            promptBoxOptions?.disableSubmitButton,
        ],
    );
};
