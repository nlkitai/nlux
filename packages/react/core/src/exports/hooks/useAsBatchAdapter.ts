import {ChatAdapterExtras} from '@shared/types/adapters/chat/chatAdapterExtras';
import {ChatAdapter} from '@shared/types/adapters/chat/chatAdapter';

/**
 * A simple hook to convert a callback function to a ChatAdapter to use to fetch data as a stream.
 *
 * @param callback
 */
export const useAsBatchAdapter = function <AiMsg = string>(
    callback: (
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ) => Promise<AiMsg>): ChatAdapter<AiMsg> {
    return {batchText: callback};
};
