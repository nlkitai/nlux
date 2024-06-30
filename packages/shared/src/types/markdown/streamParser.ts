import {HighlighterExtension, IObserver} from '../../../../js/core/src';
import {SanitizerExtension} from '@shared/sanitizer/sanitizer';

export type StreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
) => IObserver<string>;

export type StandardStreamParserOutput = {
    next(value: string): void;
    complete(): void;
    cancel(): void;
    error(error: Error): void;
};

export type StandardStreamParser = (
    root: HTMLElement,
    options?: {
        syntaxHighlighter?: HighlighterExtension,
        htmlSanitizer?: SanitizerExtension,
        markdownLinkTarget?: 'blank' | 'self';
        showCodeBlockCopyButton?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
        waitTimeBeforeStreamCompletion?: number | 'never';
        onComplete?: () => void;
    },
) => StandardStreamParserOutput;
