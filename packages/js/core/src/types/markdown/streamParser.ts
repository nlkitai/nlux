import {HighlighterExtension} from '../../exports/aiChat/highlighter/highlighter';
import {IObserver} from '../../exports/bus/observer';

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
        skipAnimation?: boolean;
        streamingAnimationSpeed?: number;
        skipCopyToClipboardButton?: boolean;
    },
) => StandardStreamParserOutput;
