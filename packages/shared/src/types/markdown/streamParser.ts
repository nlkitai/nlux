import {HighlighterExtension, IObserver} from '../../../../js/core/src';

export type StreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
) => IObserver<string>;

export type StandardStreamParserOutput = {
    next(value: string): void;
    complete(): void;
    error(error: Error): void;
};

export type StandardStreamParser = (
    root: HTMLElement,
    options?: {
        syntaxHighlighter?: HighlighterExtension,
        htmlSanitizer?: (html: string) => string,
        markdownLinkTarget?: 'blank' | 'self';
        showCodeBlockCopyButton?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
        onComplete?: () => void;
    },
) => StandardStreamParserOutput;
