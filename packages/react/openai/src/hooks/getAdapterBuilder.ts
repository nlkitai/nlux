import {ChatAdapterBuilder, ChatAdapterOptions, createUnsafeChatAdapter} from '@nlux/openai';
import {NluxUsageError} from '../../../../shared/src/types/error';

const source = 'hooks/getAdapterBuilder';

export const getAdapterBuilder = <MessageType>(options: ChatAdapterOptions): ChatAdapterBuilder<MessageType> => {
    const {
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'fetch') {
        throw new NluxUsageError({
            source,
            message: 'Data transfer mode not supported',
        });
    }

    if (!apiKey) {
        throw new NluxUsageError({
            source,
            message: 'API key is required',
        });
    }

    let newAdapter = createUnsafeChatAdapter<MessageType>().withApiKey(apiKey);

    if (model !== undefined) {
        newAdapter = newAdapter.withModel(model);
    }

    if (dataTransferMode) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    if (systemMessage) {
        newAdapter = newAdapter.withSystemMessage(systemMessage);
    }

    return newAdapter;
};
