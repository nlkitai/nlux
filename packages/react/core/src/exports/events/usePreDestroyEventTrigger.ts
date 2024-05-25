import {ChatItem, PreDestroyCallback, PreDestroyEventDetails} from '@nlux/core';
import {useEffect, useRef} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {reactPropsToCorePropsInEvents} from '../../utils/reactPropsToCorePropsInEvents';
import {AiChatProps} from '../props';

export const usePreDestroyEventTrigger = <AiMsg>(
    props: AiChatProps<AiMsg>,
    segments: ChatSegment<AiMsg>[],
): void => {
    const getChatHistoryRef = useRef<() => ChatItem<AiMsg>[]>();
    const preDestroyCallbackRef = useRef<PreDestroyCallback<AiMsg> | undefined>();

    useEffect(() => {
        // The callback function to obtain chat history is only called before the component is destroyed.
        // but its value depends on the segments, so we need to update it every time the segments change.
        getChatHistoryRef.current = () => {
            const result: ChatItem<AiMsg>[] = [];
            segments.forEach((segment) => {
                if (!segment.items || segment.items.length === 0) {
                    return;
                }

                segment.items.forEach((item) => {
                    if (item.status !== 'complete') {
                        return;
                    }

                    if (item.participantRole === 'assistant') {
                        result.push({role: 'assistant', message: item.content as AiMsg});
                        return;
                    }

                    if (item.participantRole === 'user') {
                        result.push({role: 'user', message: item.content});
                    }
                });
            });

            return result;
        };
    }, [segments]);

    useEffect(() => {
        preDestroyCallbackRef.current = props.events?.preDestroy;
    }, [props.events?.preDestroy]);

    // Ready event is only triggered once.
    // And only if the ready event callback is provided.
    useEffect(() => {
        return () => {
            const preDestroyCallback = preDestroyCallbackRef.current;
            if (!preDestroyCallback) {
                return;
            }

            const coreProps = reactPropsToCorePropsInEvents<AiMsg>(props);
            const conversationHistory = getChatHistoryRef.current?.() ?? [];

            const preDestroyEvent: PreDestroyEventDetails<AiMsg> = {
                aiChatProps: coreProps,
                conversationHistory,
            };

            preDestroyCallback(preDestroyEvent);
            getChatHistoryRef.current = undefined;
        };
    }, []);
};
