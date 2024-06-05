import {MessageOptions as JavaScriptMessageOptions} from '@nlux/core';
import {FC, RefObject} from 'react';

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
 * Props for the custom React component that renders a message sent by the server in batch mode.
 * @template AiMsg The type of the message received from the AI. Defaults to string for standard NLUX adapters.
 *
 * @property {string} uid The unique identifier of the message.
 * @property {'batch'} dataTransferMode The data transfer mode used by the adapter.
 * @property {'complete'} status The status of the message.
 *
 * @property {AiMsg} content The content of the message. The content is a single message.
 * @property {unknown} serverResponse The raw server response. The server response is a single object or string
 * representing the raw response received from the server.
 */
export type BatchResponseComponentProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'batch';
    status: 'complete';
    content: AiMsg;
    serverResponse: unknown;
};

export type ResponseRenderer<AiMsg> = FC<
    StreamResponseComponentProps<AiMsg> | BatchResponseComponentProps<AiMsg>
>;

export type BatchResponseRenderer<AiMsg> = FC<BatchResponseComponentProps<AiMsg>>;
export type StreamResponseRenderer<AiMsg> = FC<StreamResponseComponentProps<AiMsg>>;

export type PromptRendererProps = {
    uid: string;
    prompt: string;
};

export type PromptRenderer = FC<PromptRendererProps>;

export type ReactSpecificMessageOptions<AiMsg> = {
    /**
     * Custom React component to render the message received from the AI.
     */
    responseRenderer?:
        ResponseRenderer<AiMsg> |
        FC<BatchResponseComponentProps<AiMsg>> |
        FC<StreamResponseComponentProps<AiMsg>>;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptRenderer?: PromptRenderer;
};

/**
 * Options for a message in the conversation.
 * We use all options from @nlux/core except the React-specific options
 * defined in ReactSpecificMessageOptions.
 */
export type MessageOptions<AiMsg = string> =
    Omit<JavaScriptMessageOptions<AiMsg>, 'responseRenderer' | 'promptRenderer'>
    & ReactSpecificMessageOptions<AiMsg>;
