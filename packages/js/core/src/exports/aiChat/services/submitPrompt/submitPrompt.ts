import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {ChatSegment} from '../../../../types/chatSegment/chatSegment';
import {ChatSegmentObservable} from '../../../../types/chatSegment/chatSegmentObservable';

/**
 * Represents a function that can be used to submit a prompt to the chat adapter.
 * This function will return a chat segment controller that can be used to control the chat segment
 * that was created as a result of submitting the prompt.
 */
export type SubmitPrompt = <ResponseType>(
    prompt: string,
    adapter: ChatAdapter,
    adapterExtras: ChatAdapterExtras,
) => {
    segment: ChatSegment<ResponseType>,
    observable: ChatSegmentObservable<ResponseType>,
};
