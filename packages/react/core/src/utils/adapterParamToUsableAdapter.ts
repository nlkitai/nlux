import {ChatAdapter} from '../../../../shared/src/types/adapters/chat/chatAdapter';
import {ChatAdapterBuilder} from '../../../../shared/src/types/adapters/chat/chatAdapterBuilder';
import {StandardChatAdapter} from '../../../../shared/src/types/adapters/chat/standardChatAdapter';
import {warn} from '../../../../shared/src/utils/warn';

export const adapterParamToUsableAdapter = <AiMsg>(
    anAdapterOrAdapterBuilder: ChatAdapter<AiMsg> | ChatAdapterBuilder<AiMsg> | unknown,
): ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg> | undefined => {
    const adapterAsAny = anAdapterOrAdapterBuilder as Record<string, unknown>;
    if (typeof adapterAsAny?.create === 'function') {
        const adapterBuilder = adapterAsAny as unknown as ChatAdapterBuilder<AiMsg>;
        return adapterBuilder.create();
    }

    if (typeof adapterAsAny?.batchText === 'function' || typeof adapterAsAny?.streamText === 'function') {
        return anAdapterOrAdapterBuilder as ChatAdapter<AiMsg>;
    }

    warn('Unable to determine the type of the adapter! Missing batchText or streamText method.');
    return undefined;
};
