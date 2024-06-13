import {ChatAdapterExtras} from '@shared/types/adapters/chat/chatAdapterExtras';
import {ChatAdapter, StreamingAdapterObserver} from '@shared/types/adapters/chat/chatAdapter';

/**
 * A simple hook to convert a promise-based function into a ChatAdapter to use to fetch data in a single batch.
 *
 * @param callback
 */
export const useAsStreamAdapter = function <AiMsg = string>(
    callback: (
        message: string,
        observer: StreamingAdapterObserver<AiMsg>,
        extras: ChatAdapterExtras<AiMsg>,
    ) => void,
): ChatAdapter<AiMsg> {
    return {streamText: callback};
};
