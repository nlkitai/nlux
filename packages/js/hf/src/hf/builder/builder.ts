import {ChatAdapterBuilder as CoreChatAdapterBuilder, DataTransferMode, StandardChatAdapter} from '@nlux/core';
import {HfInputPreProcessor} from '../types/inputPreProcessor';
import {HfOutputPreProcessor} from '../types/outputPreProcessor';

export interface ChatAdapterBuilder<AiMsg> extends CoreChatAdapterBuilder<AiMsg> {
    /**
     * Create a new Hugging Face Inference API adapter.
     * Adapter users don't need to call this method directly. It will be called by nlux when the adapter is expected
     * to be created.
     *
     * @returns {StandardChatAdapter}
     */
    create(): StandardChatAdapter<AiMsg>;

    /**
     * The authorization token to use for Hugging Face Inference API.
     * This will be passed to the `Authorization` header of the HTTP request.
     * If no token is provided, the request will be sent without an `Authorization` header as in this example:
     * `"Authorization": f"Bearer {AUTH_TOKEN}"`.
     *
     * Public models do not require an authorization token, but if your model is private, you will need to provide one.
     *
     * @optional
     * @param {string} authToken
     * @returns {ChatAdapterBuilder}
     */
    withAuthToken(authToken: string): ChatAdapterBuilder<AiMsg>;

    /**
     * Instruct the adapter to connect to API and load data either in streaming mode or in fetch mode.
     * The `stream` mode would use protocols such as websockets or server-side events, and nlux will display data as
     * it's being generated by the server. The `fetch` mode would use a single request to fetch data, and the response
     * would only be displayed once the entire message is loaded.
     *
     * @optional
     * @default 'stream'
     * @returns {ChatAdapterBuilder}
     */
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder<AiMsg>;

    /**
     * The endpoint to use for Hugging Face Inference API.
     * You should provide either a model or an endpoint, but not both.
     * For more information, please refer to the
     * [nlux Hugging Face documentation](https://docs.nlux.ai/category/nlux-with-hugging-face).
     *
     * @optional
     * @param {string} endpoint
     * @returns {ChatAdapterBuilder}
     */
    withEndpoint(endpoint: string): ChatAdapterBuilder<AiMsg>;

    /**
     * This function will be called before sending the input to the Hugging Face Inference API.
     * It receives the input that the user has typed in the UI, and it should return the input that will be sent to the
     * API. This is useful if you want to preprocess the input before sending it to the API.
     *
     * @optional
     * @param {(input: any) => any} inputPreProcessor
     * @returns {ChatAdapterBuilder}
     */
    withInputPreProcessor(inputPreProcessor: HfInputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg>;

    /**
     * The maximum number of new tokens that can be generated by the Hugging Face Inference API.
     * This is useful if you want to limit the number of tokens that can be generated by the API.
     *
     * @optional
     * @default 500
     * @param {number} maxNewTokens
     * @returns {ChatAdapterBuilder}
     */
    withMaxNewTokens(maxNewTokens: number): ChatAdapterBuilder<AiMsg>;

    /**
     * The model or the endpoint to use for Hugging Face Inference API.
     * You should provide either a model or an endpoint, but not both.
     * For more information, please refer to the
     * [nlux Hugging Face documentation](https://docs.nlux.ai/category/nlux-with-hugging-face).
     *
     * @param {string} model
     * @returns {ChatAdapterBuilder}
     */
    withModel(model: string): ChatAdapterBuilder<AiMsg>;

    /**
     * This function will be called after receiving the output from the Hugging Face Inference API, and before
     * displaying it to the user. It can be used to preprocess the output before displaying it to the user.
     * This is useful if the model returns output in an unexpected format (JSON, special syntax),
     * and you want to convert it to a format that can be displayed in the UI.
     *
     * @param {HfOutputPreProcessor} outputPreProcessor
     * @returns {ChatAdapterBuilder}
     */
    withOutputPreProcessor(outputPreProcessor: HfOutputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg>;

    /**
     * The initial system to send to the Hugging Face Inference API.
     * This will be used during the pre-processing step to construct the payload that will be sent to the API.
     *
     * @optional
     * @param {string} message
     * @returns {ChatAdapterBuilder}
     */
    withSystemMessage(message: string): ChatAdapterBuilder<AiMsg>;
}
