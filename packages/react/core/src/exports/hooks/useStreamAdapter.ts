import {ChatAdapter, StreamSubmit} from '@shared/types/adapters/chat/chatAdapter';
import {DependencyList, useMemo} from 'react';

/**
 * A simple hook to convert a promise-based function into a ChatAdapter to use to fetch data in a single batch.
 *
 * @param submit
 * @param dependencies
 */
export const useStreamAdapter = function <AiMsg = string>(
    submit: StreamSubmit<AiMsg>, dependencies?: DependencyList,
): ChatAdapter<AiMsg> {

    return useMemo(
        () => ({streamText: submit}),
        dependencies ?? [{}], // If no dependencies are provided, we use an empty object to force the hook
        // to run every time (no memoization).
    );
};
