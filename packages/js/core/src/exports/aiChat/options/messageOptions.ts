import {HighlighterExtension} from '../highlighter/highlighter';

export type MessageOptions<AiMsg> = {
    /**
     * Indicates whether the message should be rendered as markdown.
     * @default true
     */
    useMarkdown?: boolean;

    /**
     * Indicates whether markdown links should open in a new window.
     *
     * @default false
     */
    openMdLinksInNewWindow?: boolean;

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
    responseRenderer?: (content: {response: AiMsg}) => HTMLElement | null;

    /**
     * Custom function to render the message sent by the user.
     */
    promptRenderer?: (content: {prompt: string}) => HTMLElement | null;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptComponent?: (content: {prompt: string}) => HTMLElement | null;

    /**
     * Highlighter extension for code blocks inside messages.
     */
    syntaxHighlighter?: HighlighterExtension;
}
