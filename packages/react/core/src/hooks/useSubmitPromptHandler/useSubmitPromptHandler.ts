import {
    ChatAdapter,
    ChatAdapterExtras,
    ChatSegment,
    PromptBoxOptions,
    StandardChatAdapter,
    submitPrompt,
} from '@nlux/core';
import {MutableRefObject, useCallback, useMemo} from 'react';
import {warn} from '../../../../../shared/src/utils/warn';
import {ImperativeConversationCompProps} from '../../logic/Conversation/props';

type SubmitPromptHandlerProps<MessageType> = {
    adapterToUse?: ChatAdapter | StandardChatAdapter;
    adapterExtras?: ChatAdapterExtras;
    prompt: string;
    promptBoxOptions?: PromptBoxOptions;
    showException: (message: string) => void;
    setSegmentsRef: MutableRefObject<{
        chatSegments: ChatSegment<MessageType>[];
        setChatSegments: (segments: ChatSegment<MessageType>[]) => void;
    }>;
    conversationRef: MutableRefObject<ImperativeConversationCompProps | null>
};

export const useSubmitPromptHandler = <MessageType>(props: SubmitPromptHandlerProps<MessageType>) => {
    const {
        adapterToUse,
        adapterExtras,
        prompt,
        promptBoxOptions,
        showException,
        setSegmentsRef,
        conversationRef,
    } = props;

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    return useCallback(() => {
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

            setSegmentsRef.current.setChatSegments([
                ...setSegmentsRef.current.chatSegments,
                chatSegment,
            ]);
        },
        [
            showException,
            setSegmentsRef.current,
            prompt,
            adapterToUse,
            adapterExtras,
            setSegmentsRef,
            promptBoxOptions?.disableSubmitButton,
        ],
    );
};
