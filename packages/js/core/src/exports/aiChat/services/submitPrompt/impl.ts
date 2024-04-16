import {
    ChatSegment,
    ChatSegmentEvent,
    ChatSegmentItem,
} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {
    AiUnifiedMessage,
    ChatSegmentAiMessage,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {
    AiMessageChunkReceivedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentEventsMap,
    ChatSegmentExceptionCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {ChatSegmentUserMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {ChatAdapter, DataTransferMode} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {isStandardChatAdapter, StandardChatAdapter} from '../../../../types/adapters/chat/standardChatAdapter';
import {SubmitPrompt} from './submitPrompt';

export const submitPrompt: SubmitPrompt = <MessageType>(
    prompt: string,
    adapter: ChatAdapter<MessageType>,
    extras: ChatAdapterExtras<MessageType>,
) => {
    const callbacksByEvent: Map<ChatSegmentEvent, Set<ChatSegmentEventsMap<MessageType>[ChatSegmentEvent]>> = new Map();
    const addListener = (event: ChatSegmentEvent, callback: ChatSegmentEventsMap<MessageType>[ChatSegmentEvent]) => {
        if (!callbacksByEvent.has(event)) {
            callbacksByEvent.set(event, new Set());
        }
        callbacksByEvent.get(event)!.add(callback);
    };

    const removeListener = (
        event: ChatSegmentEvent,
        callback: ChatSegmentEventsMap<MessageType>[ChatSegmentEvent],
    ) => {
        if (!callbacksByEvent.has(event)) {
            return;
        }
        callbacksByEvent.get(event)!.delete(callback);
    };

    const supportedDataTransferModes: DataTransferMode[] = [];
    if (adapter.streamText !== undefined) {
        supportedDataTransferModes.push('stream');
    }
    if (adapter.fetchText !== undefined) {
        supportedDataTransferModes.push('fetch');
    }
    if (supportedDataTransferModes.length === 0) {
        throw new Error('The adapter does not support any data transfer modes');
    }

    const adapterAsStandardAdapter: StandardChatAdapter<MessageType> | undefined = isStandardChatAdapter(adapter as any)
        ?
        adapter as any
        : undefined;

    const adapterDataTransferMode: DataTransferMode | undefined = adapterAsStandardAdapter?.dataTransferMode
        ?? undefined;

    const defaultDataTransferMode = supportedDataTransferModes.length === 1
        ? supportedDataTransferModes[0]
        : 'stream';

    const dataTransferModeToUse = adapterDataTransferMode ?? defaultDataTransferMode;

    const userMessage: ChatSegmentUserMessage = {
        uid: uid(),
        time: new Date(),
        status: 'complete',
        participantRole: 'user',
        content: prompt,
    };

    const aiMessage: ChatSegmentAiMessage<MessageType> = (dataTransferModeToUse === 'stream') ? {
        uid: uid(),
        participantRole: 'ai',
        time: new Date(),
        dataTransferMode: 'stream',
        status: 'streaming',
    } : {
        uid: uid(),
        participantRole: 'ai',
        time: new Date(),
        dataTransferMode: 'fetch',
        status: 'loading',
    };

    const chatSegment: ChatSegment<MessageType> = {
        uid: uid(),
        status: 'active',
        items: [userMessage, aiMessage],
    };

    const chatSegmentObservable: ChatSegmentObservable<MessageType> = {
        get segmentId() {
            return chatSegment.uid;
        },
        on: addListener,
        removeListener,
        destroy: () => callbacksByEvent.clear(),
    };

    //
    // Handle message in streaming mode
    //
    if (dataTransferModeToUse === 'stream') {
        adapter.streamText!(prompt, {
            next: (chunk: string) => {
                callbacksByEvent.get('aiChunkReceived')?.forEach(callback => {
                    const messageCallback = callback as AiMessageChunkReceivedCallback;
                    messageCallback(aiMessage.uid, chunk);
                });
            },
            complete: () => {
                const updatedChatSegment = {
                    ...chatSegment,
                    status: 'complete',
                } satisfies ChatSegment<MessageType>;

                chatSegment.status = 'complete';
                callbacksByEvent.get('complete')?.forEach(callback => {
                    const completeCallback = callback as ChatSegmentCompleteCallback<MessageType>;
                    completeCallback(updatedChatSegment);
                });

                callbacksByEvent.clear();
            },
            error: (error: Error) => {
                chatSegment.status = 'error';
                callbacksByEvent.get('exception')?.forEach(callback => {
                    const errorCallback = callback as ChatSegmentExceptionCallback;
                    errorCallback({
                        type: 'error',
                        message: error.message,
                    });
                });

                callbacksByEvent.clear();
            },
        }, extras);

        return {
            segment: chatSegment,
            observable: chatSegmentObservable,
        };
    }

    //
    // Handle message in fetch mode
    //
    adapter.fetchText!(prompt, extras).then((message: any) => {
        if (aiMessage.dataTransferMode !== 'fetch' || aiMessage.status !== 'loading') {
            warn('The AI message was already completed or is not in fetch mode');
            return;
        }

        const newAiMessage: AiUnifiedMessage<MessageType> = {
            ...aiMessage,
            status: 'complete',
            content: message,
        };

        const items: ChatSegmentItem<MessageType>[] = chatSegment.items.map(item => {
            if (item.uid === aiMessage.uid) {
                return newAiMessage;
            }

            return item;
        });

        const newChatSegment: ChatSegment<MessageType> = {
            ...chatSegment,
            status: 'complete',
            items,
        };

        callbacksByEvent.get('complete')?.forEach(callback => {
            const completeCallback = callback as ChatSegmentCompleteCallback<MessageType>;
            completeCallback(newChatSegment);
        });
        callbacksByEvent.clear();
    }).catch((error: Error) => {
        chatSegment.status = 'error';
        callbacksByEvent.get('exception')?.forEach(callback => {
            const errorCallback = callback as ChatSegmentExceptionCallback;
            errorCallback({
                type: 'error',
                message: error.message,
            });
        });
        callbacksByEvent.clear();
    });

    return {
        segment: chatSegment,
        observable: chatSegmentObservable,
    };
};
