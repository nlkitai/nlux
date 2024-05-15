import {MessageOptions as JavascriptMessageOptions} from '@nlux/core';
import {FC, RefObject} from 'react';

/**
 * Props for the custom React component that renders a message received from the AI.
 * @template AiMsg The type of the message received from the AI. Defaults to string for standard NLUX adapters.
 *
 * @property {string} uid The unique identifier of the message.
 * @property {'stream' | 'fetch'} dataTransferMode The data transfer mode used by the adapter.
 *
 * @property {'streaming' | 'complete'} status The status of the message. When the data transfer mode is 'fetch',
 * the status is always 'complete'. When the data transfer mode is 'stream', the status is 'streaming' until the
 * message is complete. The status is 'complete' when the message is fully received.
 *
 * @property {AiMsg | AiMsg[]} [content] The content of the message. When the data transfer mode is 'fetch',
 * the content is always a single message. When the data transfer mode is 'stream', the content is an array of
 * messages. The content is undefined when the status is 'streaming'.
 *
 * @property {unknown | unknown[]} [serverResponse] The raw server response. When the data transfer mode is 'fetch',
 * the server response is always a single object or string representing the response received from the server.
 * When the data transfer mode is 'stream', the server response is an array of objects or strings representing each
 * chunk of the response received from the server. The server response is undefined when the status is 'streaming'.
 */

/**
 * Props for the custom React component that renders a message sent by the server in streaming mode.
 * @template AiMsg The type of the message received from the AI. Defaults to string for standard NLUX adapters.
 *
 * @property {string} uid The unique identifier of the message.
 * @property {'stream'} dataTransferMode The data transfer mode used by the adapter.
 * @property {'streaming' | 'complete'} status The status of the message.
 *
 * @property {AiMsg[]} content The content of the message. The content is an array of messages. The content is undefined
 * when the status is 'streaming'. The content is an array of messages when the status is 'complete'.
 *
 * @property {unknown[]} serverResponse The raw server response. The server response is an array of objects or strings
 * representing each raw chunk of the response received from the server. The server response is undefined when the
 * status is 'streaming'. The server response is an array of objects or strings when the status is 'complete'.
 *
 * @property {RefObject<never>} containerRef A reference to the HTML element that contains the message to be streamed.
 */
export type StreamResponseComponentProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'stream';
    status: 'streaming' | 'complete';
    content?: AiMsg[];
    serverResponse?: unknown[];
    containerRef: RefObject<never>;
};

/**
 * Props for the custom React component that renders a message sent by the server in fetch mode.
 * @template AiMsg The type of the message received from the AI. Defaults to string for standard NLUX adapters.
 *
 * @property {string} uid The unique identifier of the message.
 * @property {'fetch'} dataTransferMode The data transfer mode used by the adapter.
 * @property {'complete'} status The status of the message.
 *
 * @property {AiMsg} content The content of the message. The content is a single message.
 * @property {unknown} serverResponse The raw server response. The server response is a single object or string
 * representing the raw response received from the server.
 */
export type FetchResponseComponentProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'fetch';
    status: 'complete';
    content: AiMsg;
    serverResponse: unknown;
};

export type ResponseComponent<AiMsg> = FC<StreamResponseComponentProps<AiMsg>> | FC<FetchResponseComponentProps<AiMsg>>;

export type PromptComponentProps = {
    uid: string;
    prompt: string;
};

export type PromptComponent = FC<PromptComponentProps>;

export type ReactSpecificMessageOptions<AiMsg> = {
    /**
     * Custom React component to render the message received from the AI.
     */
    responseComponent?: ResponseComponent<AiMsg>;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptComponent?: PromptComponent;
};

/**
 * Options for a message in the conversation.
 * We use all options from @nlux/core except the React-specific options
 * defined in ReactSpecificMessageOptions.
 */
export type MessageOptions<AiMsg> =
    Omit<JavascriptMessageOptions<AiMsg>, 'responseRenderer' | 'promptRenderer'>
    & ReactSpecificMessageOptions<AiMsg>;
