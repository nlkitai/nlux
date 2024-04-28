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
    responseRenderer?: ResponseRenderer<AiMsg>;

    /**
     * Custom function to render the message sent by the user.
     */
    promptRenderer?: PromptRenderer;

    /**
     * Highlighter extension for code blocks inside messages.
     */
    syntaxHighlighter?: HighlighterExtension;
}
