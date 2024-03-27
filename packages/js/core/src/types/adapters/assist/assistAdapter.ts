import {ChatAdapterExtras} from '../chat/chatAdapterExtras';

/**
 * This type represents the result of an assist request.
 *
 * If the request was successful, the `success` property will be `true` and the `response` property will contain the
 * text response to be displayed to the user. In addition, when the `task` property is present, it will contain the
 * details of the task to be executed by the client.
 *
 * If the request was not successful, the `success` property will be `false` and the `error` property will contain the
 * error message to be displayed to the user.
 */
export type AssistResult = {
    success: true;
    response: string;
    task?: {
        id: string;
        parameters: string[];
    };
} | {
    success: false;
    error: string;
};

/**
 * This interface exposes methods that should be implemented by adapters used when the AiChat is in co-pilot mode.
 * The difference between this and the `ChatAdapter` interface is that this adapter can return a task to be executed
 * by the client in addition to the text response to be displayed.
 *
 * Assist adapters can only be used in fetch mode, and the response cannot be streamed.
 */
export interface AssistAdapter {
    /**
     * This method should be implemented by any adapter that wants to request data from the API in fetch mode.
     * It should return a promise that resolves to the response from the API.
     * Either this method or `streamText` (or both) should be implemented by any adapter.
     *
     * @param `string` message
     * @param `ChatAdapterExtras` extras
     * @returns Promise<string>
     */
    assist?: (message: string, extras: ChatAdapterExtras) => Promise<AssistResult>;
}
