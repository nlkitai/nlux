import {HighlighterExtension} from '../../core/aiChat/highlighter/highlighter';
import {IObserver} from '../../core/bus/observer';

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
        skipAnimation?: boolean;
        streamingAnimationSpeed?: number;
        skipCopyToClipboardButton?: boolean;
    },
) => StandardStreamParserOutput;
