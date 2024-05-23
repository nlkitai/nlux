import {HighlighterExtension} from '../highlighter/highlighter';

/**
 * Props for the custom function that renders a message sent by the server in streaming mode.
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
 */
export type StreamResponseComponentProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'stream';
    status: 'streaming' | 'complete';
    content?: AiMsg[];
    serverResponse?: unknown[];
};

/**
 * Props for the custom function that renders a message sent by the server in batch mode.
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

export type ResponseRenderer<AiMsg> = (
    (props: StreamResponseComponentProps<AiMsg>) => HTMLElement | null
) | (
    (props: BatchResponseComponentProps<AiMsg>) => HTMLElement | null
);

export type PromptRendererProps = {
    uid: string;
    content: string;
};

export type PromptRenderer = (props: PromptRendererProps) => HTMLElement | null;

export type MessageOptions<AiMsg = string> = {
    /**
     * Highlighter extension for code blocks inside messages.
     */
    syntaxHighlighter?: HighlighterExtension;

    /**
     * Indicates the target of the links in the markdown messages.
     * - 'blank': Open links in a new tab.
     * - 'self': Open links in the same tab.
     *
     * @default 'blank'
     */
    markdownLinkTarget?: 'blank' | 'self';

    /**
     * Indicates whether the copy button should be shown for code blocks.
     *
     * @default true
     */
    showCodeBlockCopyButton?: boolean;

    /**
     * Indicates whether the streaming animation should be skipped.
     *
     * @default false
     */
    skipStreamingAnimation?: boolean;

    /**
     * The interval in milliseconds at which new characters are added when a message is being generated and
     * streamed to the user.
     *
     * @default 10
     */
    streamingAnimationSpeed?: number;

    /**
     * Custom function to render the message received from the AI.
     */
    responseRenderer?: ResponseRenderer<AiMsg>;

    /**
     * Custom function to render the message sent by the user.
     */
    promptRenderer?: PromptRenderer;
}
