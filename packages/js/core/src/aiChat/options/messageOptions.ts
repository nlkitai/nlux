import {HighlighterExtension} from '../highlighter/highlighter';
import {SanitizerExtension} from '@shared/sanitizer/sanitizer';

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
export type ResponseRendererProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'stream' | 'batch';
    status: 'streaming' | 'complete';
    content: [AiMsg];
    serverResponse: unknown[];
};

export type ResponseRenderer<AiMsg> = (props: ResponseRendererProps<AiMsg>) => HTMLElement | null;

export type PromptRendererProps = {
    uid: string;
    prompt: string;
};

export type PromptRenderer = (props: PromptRendererProps) => HTMLElement | null;

export type MessageOptions<AiMsg = string> = {
    /**
     * Highlighter extension for code blocks inside messages.
     */
    syntaxHighlighter?: HighlighterExtension;

    /**
     * Custom function to sanitize the HTML content of the messages. This function is called before any HTML content
     * is rendered in the chat.
     *
     * @param {string} html
     * @returns {string}
     */
    htmlSanitizer?: SanitizerExtension;

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
     * In streaming data transfer mode, this represents the wait time in milliseconds after last chunk of data
     * is received before marking the streaming as complete. This can be used to prevent the streaming from being
     * marked as complete too early.
     *
     * If set to 'never', the streaming will never be automatically be marked as complete. It will be up to the
     * adapter to manually mark the streaming as complete by calling the `observer.complete()` method.
     *
     * @default 2000
     */
    waitTimeBeforeStreamCompletion?: number | 'never';

    /**
     * Custom function to render the message received from the AI.
     */
    responseRenderer?: ResponseRenderer<AiMsg>;

    /**
     * Custom function to render the message sent by the user.
     */
    promptRenderer?: PromptRenderer;

    /**
     * Indicates whether the user should be able to edit the message after sending it.
     * Editing a message will replace the original message and will remove all subsequent messages in the conversation.
     *
     * @default false
     */
    editableUserMessages?: boolean;
}
