import {ChatAdapter, DataTransferMode} from '../../../../../../../shared/src/types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../../../../shared/src/types/adapters/chat/chatAdapterExtras';
import {
    isStandardChatAdapter,
    StandardChatAdapter,
} from '../../../../../../../shared/src/types/adapters/chat/standardChatAdapter';
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
    ChatSegmentErrorCallback,
    ChatSegmentEventsMap,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {ChatSegmentUserMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {SubmitPrompt} from './submitPrompt';

export const submitPrompt: SubmitPrompt = <AiMsg>(
    prompt: string,
    adapter: ChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
) => {
    const callbacksByEvent: Map<ChatSegmentEvent, Set<ChatSegmentEventsMap<AiMsg>[ChatSegmentEvent]>> = new Map();
    const addListener = (event: ChatSegmentEvent, callback: ChatSegmentEventsMap<AiMsg>[ChatSegmentEvent]) => {
        if (!callbacksByEvent.has(event)) {
            callbacksByEvent.set(event, new Set());
        }
        callbacksByEvent.get(event)!.add(callback);
    };

    const removeListener = (
        event: ChatSegmentEvent,
        callback: ChatSegmentEventsMap<AiMsg>[ChatSegmentEvent],
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

    const adapterAsStandardAdapter: StandardChatAdapter<AiMsg> | undefined = isStandardChatAdapter(adapter as any)
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

    const aiMessage: ChatSegmentAiMessage<AiMsg> = (dataTransferModeToUse === 'stream') ? {
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

    const chatSegment: ChatSegment<AiMsg> = {
        uid: uid(),
        status: 'active',
        items: [userMessage, aiMessage],
    };

    const chatSegmentObservable: ChatSegmentObservable<AiMsg> = {
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
                } satisfies ChatSegment<AiMsg>;

                chatSegment.status = 'complete';
                callbacksByEvent.get('complete')?.forEach(callback => {
                    const completeCallback = callback as ChatSegmentCompleteCallback<AiMsg>;
                    completeCallback(updatedChatSegment);
                });

                callbacksByEvent.clear();
            },
            error: (error: Error) => {
                chatSegment.status = 'error';
                callbacksByEvent.get('error')?.forEach(callback => {
                    const errorCallback = callback as ChatSegmentErrorCallback;
                    errorCallback('connection-error');
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

        const newAiMessage: AiUnifiedMessage<AiMsg> = {
            ...aiMessage,
            status: 'complete',
            content: message,
        };

        const items: ChatSegmentItem<AiMsg>[] = chatSegment.items.map(item => {
            if (item.uid === aiMessage.uid) {
                return newAiMessage;
            }

            return item;
        });

        const newChatSegment: ChatSegment<AiMsg> = {
            ...chatSegment,
            status: 'complete',
            items,
        };

        callbacksByEvent.get('complete')?.forEach(callback => {
            const completeCallback = callback as ChatSegmentCompleteCallback<AiMsg>;
            completeCallback(newChatSegment);
        });
        callbacksByEvent.clear();
    }).catch((error: Error) => {
        chatSegment.status = 'error';
        callbacksByEvent.get('error')?.forEach(callback => {
            const errorCallback = callback as ChatSegmentErrorCallback;
            errorCallback('failed-to-load-content');
        });
        callbacksByEvent.clear();
    });

    return {
        segment: chatSegment,
        observable: chatSegmentObservable,
    };
};
