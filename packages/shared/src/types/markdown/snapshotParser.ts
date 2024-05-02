import {HighlighterExtension} from '../../../../js/core/src/exports/aiChat/highlighter/highlighter';

export type SnapshotParserOptions = {
    openLinksInNewWindow?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    skipCopyToClipboardButton?: boolean;
};

export type SnapshotParser = (
    root: HTMLElement,
    options?: {
        syntaxHighlighter?: HighlighterExtension,
        openLinksInNewWindow?: boolean;
        skipCopyToClipboardButton?: boolean;
    },
) => (snapshot: string) => void;
