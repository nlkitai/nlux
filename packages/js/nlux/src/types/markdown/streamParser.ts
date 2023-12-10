import {IObserver} from '../../core/bus/observer';
import {HighlighterExtension} from '../../core/highlighter/highlighter';

export type StreamParser = (
    root: HTMLElement,
    syntaxHighlighter?: HighlighterExtension,
    options?: {
        skipAnimation?: boolean;
    },
) => IObserver<string>;
