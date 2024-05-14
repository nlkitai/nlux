import {HighlighterExtension} from '../../../../js/core/src/exports/aiChat/highlighter/highlighter';
import {IObserver} from '../../../../js/core/src/exports/bus/observer';
import {CallbackFunction} from '../callbackFunction';

export type StreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
) => IObserver<string>;

export type StandardStreamParserOutput = IObserver<string> & {
    onComplete(completeCallback: CallbackFunction): void;
}

export type StandardStreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
    options?: {
        markdownLinkTarget?: 'blank' | 'self';
        showCodeBlockCopyButton?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
    },
) => StandardStreamParserOutput;
