import {BatchSend, StreamSend} from '@shared/types/adapters/chat/chatAdapter';
import {StreamSendServerComponent} from '@shared/types/adapters/chat/serverComponentChatAdapter';

/**
 * This interface exposes methods that should be implemented by any chat adapter to connect the AiChat component
 * to any API or AI backend. Chat adapters can be used to request data from the API in batch mode or stream mode.
 *
 * The difference between this and the `AssistAdapter` interface is that this adapter can only return a text response
 * to be displayed to the user. It cannot return a task to be executed by the client. If you are using the `AiChat`
 * component in co-pilot mode, you should use the `AssistAdapter` interface instead.
 */
export interface ChatAdapter<AiMsg = string> {
    /**
     * This method should be implemented by any adapter that wants to request data from the API in batch mode.
     * It should return a promise that resolves to the response from the API.
     * Either this method or `streamText` (or both) should be implemented by any adapter.
     *
     * @param `string` message
     * @param `ChatAdapterExtras` extras
     * @returns Promise<string>
     */
    batchText?: BatchSend<AiMsg>;

    /**
     * This method should be implemented by any adapter that wants to send a prompt to the API and get
     * a React Server Component in return.
     *
     * @param `string` message
     * @param `ChatAdapterExtras` extras
     * @returns Promise<string>
     */
    streamServerComponent?: StreamSendServerComponent<AiMsg>;

    /**
     * This method should be implemented by any adapter to be used with nlux.
     * Either this method or `batchText` (or both) should be implemented by any adapter.
     *
     * @param {string} message
     * @param {StreamingAdapterObserver} observer
     * @param {ChatAdapterExtras} extras
     */
    streamText?: StreamSend<AiMsg>;
}
