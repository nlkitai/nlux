import {IObserver} from '../../core/bus/observer';
import {HighlighterExtension} from '../../core/highlighter/highlighter';

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
        skipCopyToClipboardButton?: boolean;
    },
) => StandardStreamParserOutput;
