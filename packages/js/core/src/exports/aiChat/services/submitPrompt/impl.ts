import {ChatAdapter, DataTransferMode} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {
    AiUnifiedMessage,
    ChatSegment,
    ChatSegmentAiMessage,
    ChatSegmentChunkCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
    ChatSegmentEvent,
    ChatSegmentEventsMap,
    ChatSegmentItem,
    ChatSegmentUserMessage,
} from '../../../../types/chatSegment';
import {uid} from '../../../../utils/uid';
import {warn} from '../../../../utils/warn';
import {SubmitPrompt} from './submitPrompt';

export const submitPrompt: SubmitPrompt = <ResponseType>(
    prompt: string,
    adapter: ChatAdapter,
    extras: ChatAdapterExtras,
    preferredDataTransferMode: DataTransferMode,
) => {
    const callbacksByEvent: Map<ChatSegmentEvent, Set<Function>> = new Map();
    const addListener = (event: ChatSegmentEvent, callback: ChatSegmentEventsMap<ResponseType>[ChatSegmentEvent]) => {
        if (!callbacksByEvent.has(event)) {
            callbacksByEvent.set(event, new Set());
        }
        callbacksByEvent.get(event)!.add(callback);
    };

    const removeListener = (event: ChatSegmentEvent, callback: Function) => {
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

    const dataTransferMode = supportedDataTransferModes.length === 1
        ? supportedDataTransferModes[0]
        : preferredDataTransferMode;

    const userMessage: ChatSegmentUserMessage = {
        uid: uid(),
        time: new Date(),
        status: 'complete',
        participantRole: 'user',
        content: prompt,
    };

    const aiMessage: ChatSegmentAiMessage<ResponseType> = (dataTransferMode === 'stream') ? {
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

    const chatSegment: ChatSegment<ResponseType> = {
        uid: uid(),
        status: 'active',
        items: [userMessage, aiMessage],
        on: addListener,
        removeListener: removeListener,
    };

    //
    // Handle message in streaming mode
    //
    if (dataTransferMode === 'stream') {
        adapter.streamText!(prompt, {
            next: (chunk: string) => {
                callbacksByEvent.get('chunk')?.forEach(callback => {
                    const messageCallback = callback as ChatSegmentChunkCallback;
                    messageCallback(aiMessage.uid, chunk);
                });
            },
            complete: () => {
                const updatedChatSegment = {
                    ...chatSegment,
                    status: 'complete',
                } satisfies ChatSegment<ResponseType>;

                chatSegment.status = 'complete';
                callbacksByEvent.get('complete')?.forEach(callback => {
                    const completeCallback = callback as ChatSegmentCompleteCallback<ResponseType>;
                    completeCallback(updatedChatSegment);
                });

                callbacksByEvent.clear();
            },
            error: (error: Error) => {
                chatSegment.status = 'error';
                callbacksByEvent.get('error')?.forEach(callback => {
                    const errorCallback = callback as ChatSegmentErrorCallback;
                    errorCallback(error);
                });

                callbacksByEvent.clear();
            },
        }, extras);

        return chatSegment;
    }

    //
    // Handle message in fetch mode
    //
    adapter.fetchText!(prompt, extras).then((message: any) => {
        if (aiMessage.dataTransferMode !== 'fetch' || aiMessage.status !== 'loading') {
            warn('The AI message was already completed or is not in fetch mode');
            return;
        }

        const newAiMessage: AiUnifiedMessage<ResponseType> = {
            ...aiMessage,
            status: 'complete',
            content: message,
        };

        const items: ChatSegmentItem<ResponseType>[] = chatSegment.items.map(item => {
            if (item.uid === aiMessage.uid) {
                return newAiMessage;
            }

            return item;
        });

        const newChatSegment: ChatSegment<ResponseType> = {
            ...chatSegment,
            status: 'complete',
            items,
        };

        callbacksByEvent.get('complete')?.forEach(callback => {
            const completeCallback = callback as ChatSegmentCompleteCallback<ResponseType>;
            completeCallback(newChatSegment);
        });
        callbacksByEvent.clear();
    }).catch((error: Error) => {
        chatSegment.status = 'error';
        callbacksByEvent.get('error')?.forEach(callback => callback(error));
        callbacksByEvent.clear();
    });

    return chatSegment;
};
