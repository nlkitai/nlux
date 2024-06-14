import {ChatAdapter, StreamSend} from '@shared/types/adapters/chat/chatAdapter';
import {DependencyList, useMemo} from 'react';

/**
 * Use the function provided as a stream adapter to send messages and receive responses in a stream of chunks.
 *
 * @param submit
 * @param dependencies
 */
export const useAsStreamAdapter = function <AiMsg = string>(
    submit: StreamSend<AiMsg>, dependencies?: DependencyList,
): ChatAdapter<AiMsg> {

    return useMemo(
        () => ({streamText: submit}),
        dependencies ?? [{}], // If no dependencies are provided, we use an empty object to force the hook
        // to run every time (no memoization).
    );
};
