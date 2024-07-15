import {ChatAdapter as CoreChatAdapter, DataTransferMode} from '../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {ServerComponentChatAdapter} from '../../types/adapters/chat/serverComponentChatAdapter';
import {StandardChatAdapter} from '../../types/adapters/chat/standardChatAdapter';
import {ChatSegment} from '../../types/chatSegment/chatSegment';
import {ChatSegmentObservable} from '../../types/chatSegment/chatSegmentObservable';

/**
 * Represents a function that can be used to submit a prompt to the chat adapter.
 * This function will return a chat segment controller that can be used to control the chat segment
 * that was created as a result of submitting the prompt.
 */
export type SubmitPrompt = <AiMsg>(
    prompt: string,
    adapter: CoreChatAdapter<AiMsg> | ServerComponentChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
    adapterExtras: ChatAdapterExtras<AiMsg>,
) => {
    dataTransferMode: DataTransferMode,
    segment: ChatSegment<AiMsg>,
    observable: ChatSegmentObservable<AiMsg>,
};
