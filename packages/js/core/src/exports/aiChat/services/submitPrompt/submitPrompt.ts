import {ChatSegment} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatSegmentObservable} from '../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';

/**
 * Represents a function that can be used to submit a prompt to the chat adapter.
 * This function will return a chat segment controller that can be used to control the chat segment
 * that was created as a result of submitting the prompt.
 */
export type SubmitPrompt = <MessageType>(
    prompt: string,
    adapter: ChatAdapter<MessageType>,
    adapterExtras: ChatAdapterExtras<MessageType>,
) => {
    segment: ChatSegment<MessageType>,
    observable: ChatSegmentObservable<MessageType>,
};
