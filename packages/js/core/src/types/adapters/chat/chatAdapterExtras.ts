import {AiChatProps} from '../../aiChat/props';
import {ChatItem} from '../../conversation';

/**
 * Additional data sent to the adapter when a message is sent.
 */
export type ChatAdapterExtras = {
    /**
     * This attribute contains the properties used with the AiChat component.
     */
    aiChatProps: AiChatProps;

    /**
     * This attribute contains the conversation history.
     * It's only included if the `conversationOptions.historyPayloadSize` is set to a positive number or 'all'.
     */
    conversationHistory?: Readonly<ChatItem[]>;

    /**
     * This attribute contains the unique identifier of the context instance.
     * It's only included if a context instance is used with the AiChat component.
     * This can be used to send the context ID to the API and get a response that is specific to the context instance.
     */
    contextId?: string;

    /**
     * This contains the headers that implementers can use to send additional data such as authentication headers.
     */
    headers?: Record<string, string>;
}
