import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {ChatAdapter, DataTransferMode} from '../../../../types/adapters/chat/chatAdapter';
import {
    ConversationPart,
    ConversationPartAiMessage,
    ConversationPartChunkCallback,
    ConversationPartCompleteCallback,
    ConversationPartErrorCallback,
    ConversationPartEvent,
    ConversationPartEventsMap,
    ConversationPartUpdateCallback,
    ConversationPartUserMessage,
} from '../../../../types/conversationPart';
import {uid} from '../../../../x/uid';
import {SubmitPrompt} from './submitPrompt';

export const submitPrompt: SubmitPrompt<ResponseType> = (
    prompt: string,
    adapter: ChatAdapter,
    extras: ChatAdapterExtras,
    preferredDataTransferMode: DataTransferMode,
) => {
    const callbacksByEvent: Map<ConversationPartEvent, Set<Function>> = new Map();
    const addListener = (event: ConversationPartEvent, callback: ConversationPartEventsMap[ConversationPartEvent]) => {
        if (!callbacksByEvent.has(event)) { callbacksByEvent.set(event, new Set()); }
        callbacksByEvent.get(event)!.add(callback);
    };

    const removeListener = (event: ConversationPartEvent, callback: Function) => {
        if (!callbacksByEvent.has(event)) { return; }
        callbacksByEvent.get(event)!.delete(callback);
    }

    const supportedDataTransferModes: DataTransferMode[] = [];
    if (adapter.streamText !== undefined) { supportedDataTransferModes.push('stream'); }
    if (adapter.fetchText !== undefined) { supportedDataTransferModes.push('fetch'); }
    if (supportedDataTransferModes.length === 0) {
        throw new Error('The adapter does not support any data transfer modes');
    }

    const dataTransferMode = supportedDataTransferModes.length === 1
        ? supportedDataTransferModes[0]
        : preferredDataTransferMode;

    const userMessage: ConversationPartUserMessage = {
        uid: uid(),
        participantRole: 'user',
        time: new Date(),
        content: prompt,
    };

    const aiMessage: ConversationPartAiMessage<ResponseType> = {
        uid: uid(),
        participantRole: 'ai',
        time: new Date(),
        type: dataTransferMode === 'stream' ? 'stream' : 'message',
    };

    const part: ConversationPart<ResponseType> = {
        uid: uid(),
        status: 'active',
        messages: [userMessage, aiMessage],
        on: addListener,
        removeListener: removeListener,
    }

    //
    // Handle message in streaming mode
    //
    if (dataTransferMode === 'stream') {
        adapter.streamText!(prompt, {
            next: (chunk: ResponseType) => {
                callbacksByEvent.get('chunk')?.forEach(callback => {
                    const messageCallback = callback as ConversationPartChunkCallback;
                    messageCallback(aiMessage.uid, chunk);
                });
            },
            complete: () => {
                part.status = 'complete';
                callbacksByEvent.get('complete')?.forEach(callback => {
                    const completeCallback = callback as ConversationPartCompleteCallback;
                    completeCallback();
                });
                callbacksByEvent.clear();
            },
            error: (error: Error) => {
                part.status = 'error';
                callbacksByEvent.get('error')?.forEach(callback => {
                    const errorCallback = callback as ConversationPartErrorCallback;
                    errorCallback(error);
                });
                callbacksByEvent.clear();
            },
        }, extras);

        return part;
    }

    //
    // Handle message in fetch mode
    //
    adapter.fetchText!(prompt, extras).then((message: any) => {
        aiMessage.content = message;
        part.status = 'complete';
        callbacksByEvent.get('update')?.forEach(callback => {
            const messageCallback = callback as ConversationPartUpdateCallback;
            messageCallback('ai', 'complete', message);
        });
        callbacksByEvent.get('complete')?.forEach(callback => {
            const completeCallback = callback as ConversationPartCompleteCallback;
            completeCallback();
        });
        callbacksByEvent.clear();
    }).catch((error: Error) => {
        part.status = 'error';
        callbacksByEvent.get('error')?.forEach(callback => callback(error));
        callbacksByEvent.clear();
    });

    return part;
};
