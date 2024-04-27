import {FunctionComponent} from 'react';
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
     * Custom AI message renderer.
     */
    aiMessageComponent?: FunctionComponent<{message: AiMsg}>;

    /**
     * Highlighter extension for code blocks inside messages.
     */
    syntaxHighlighter?: HighlighterExtension;
}
