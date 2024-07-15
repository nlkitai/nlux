import {ChatAdapterBuilder, ChatAdapterOptions, createChatAdapter} from '@nlux/bedrock';
import {NluxUsageError} from '@shared/types/error';

const source = 'hooks/getAdapterBuilder';

export const getAdapterBuilder = <AiMsg>(options: ChatAdapterOptions): ChatAdapterBuilder<AiMsg> => {
    const {model, credentials, dataTransferMode} = options || {};

    if (
        dataTransferMode &&
        dataTransferMode !== 'stream' &&
        dataTransferMode !== 'batch'
    ) {
        throw new NluxUsageError({
            source,
            message:
                'Data transfer mode for Hugging Face Inference API must be either "stream" or "batch"',
        });
    }

    if (model === undefined) {
        throw new NluxUsageError({
            source,
            message:
                'You must provide either a model or an endpoint to use Hugging Face Inference API.',
        });
    }

    let newAdapter = createChatAdapter<AiMsg>().withModel(model);

    if (credentials !== undefined) {
        newAdapter = newAdapter.withCredintial(credentials);
    }

    if (dataTransferMode !== undefined) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    return newAdapter;
};
