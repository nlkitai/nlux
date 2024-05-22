import {HighlighterExtension} from '../highlighter/highlighter';

export type ResponseRendererProps<AiMsg> = {
    uid: string;
    response: AiMsg;
};

export type ResponseRenderer<AiMsg> = (content: ResponseRendererProps<AiMsg>) => HTMLElement | null;

export type PromptRendererProps = {
    uid: string;
    prompt: string;
};

export type PromptRenderer = (content: PromptRendererProps) => HTMLElement | null;

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
