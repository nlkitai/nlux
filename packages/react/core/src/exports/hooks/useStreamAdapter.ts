import {ChatAdapterExtras} from '@shared/types/adapters/chat/chatAdapterExtras';
import {ChatAdapter, StreamingAdapterObserver} from '@shared/types/adapters/chat/chatAdapter';
import {DependencyList, useMemo} from 'react';

export type SubmitStream<AiMsg> = (
    message: string,
    observer: StreamingAdapterObserver<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
) => void;

/**
 * A simple hook to convert a promise-based function into a ChatAdapter to use to fetch data in a single batch.
 *
 * @param submit
 * @param dependencies
 */
export const useStreamAdapter = function <AiMsg = string>(
    submit: SubmitStream<AiMsg>,
    dependencies?: DependencyList,
): ChatAdapter<AiMsg> {

    return useMemo(
        () => ({streamText: submit}),
        dependencies ?? [{}], // If no dependencies are provided, we use an empty object to force the hook
        // to run every time (no memoization).
    );
};
