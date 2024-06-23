import {ChatAdapterBuilder} from '@shared/types/adapters/chat/chatAdapterBuilder';
import {StandardChatAdapter} from '@shared/types/adapters/chat/standardChatAdapter';
import {warn} from '@shared/utils/warn';
import {ChatAdapter} from '../types/chatAdapter';

export const adapterParamToUsableAdapter = <AiMsg>(
    anAdapterOrAdapterBuilder: ChatAdapter<AiMsg> | ChatAdapterBuilder<AiMsg> | unknown,
): ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg> | undefined => {
    const adapterAsAny = anAdapterOrAdapterBuilder as Record<string, unknown>;
    if (typeof adapterAsAny?.create === 'function') {
        const adapterBuilder = adapterAsAny as unknown as ChatAdapterBuilder<AiMsg>;
        return adapterBuilder.create();
    }

    if (
        typeof adapterAsAny?.batchText === 'function' ||
        typeof adapterAsAny?.streamText === 'function' ||
        typeof adapterAsAny?.streamServerComponent === 'function'
    ) {
        return anAdapterOrAdapterBuilder as ChatAdapter<AiMsg>;
    }

    warn('Unable to determine the type of the adapter! Missing batchText or streamText method.');
    return undefined;
};
