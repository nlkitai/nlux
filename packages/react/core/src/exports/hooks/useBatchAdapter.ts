import {BatchSend, ChatAdapter} from '@shared/types/adapters/chat/chatAdapter';
import {DependencyList, useMemo} from 'react';

/**
 * A simple hook to convert a callback function to a ChatAdapter to use to fetch data as a stream.
 *
 * @param send
 * @param dependencies
 */
export const useBatchAdapter = function <AiMsg = string>(
    send: BatchSend<AiMsg>,
    dependencies?: DependencyList,
): ChatAdapter<AiMsg> {

    return useMemo(
        () => ({batchText: send}),
        dependencies ?? [{}], // If no dependencies are provided, we use an empty object to force the hook
        // to run every time (no memoization).
    );
};
