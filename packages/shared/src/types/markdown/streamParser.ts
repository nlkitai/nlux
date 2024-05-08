import {HighlighterExtension} from '../../../../js/core/src/exports/aiChat/highlighter/highlighter';
import {IObserver} from '../../../../js/core/src/exports/bus/observer';

export type StreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
) => IObserver<string>;

export type StandardStreamParserOutput = IObserver<string> & {
    onComplete(completeCallback: Function): void;
}

export type StandardStreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
    options?: {
        openLinksInNewWindow?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
        showCodeBlockCopyButton?: boolean;
    },
) => StandardStreamParserOutput;
