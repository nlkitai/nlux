import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {ChatAdapter, DataTransferMode} from '../../../../types/adapters/chat/chatAdapter';
import {ConversationPart} from '../../../../types/conversationPart';

/**
 * Represents a function that can be used to submit a prompt to the chat adapter.
 * This function will return a conversation part controller that can be used to control the conversation part
 * that was created as a result of submitting the prompt.
 */
export type SubmitPrompt<ResponseType> = (
    prompt: string,
    adapter: ChatAdapter,
    adapterExtras: ChatAdapterExtras,
    preferredDataTransferMode: DataTransferMode,
) => ConversationPart<ResponseType>;
