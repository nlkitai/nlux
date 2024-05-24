import {HighlighterExtension} from '../../../../js/core/src/exports/aiChat/highlighter/highlighter';

export type SnapshotParserOptions = {
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: (html: string) => string;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
};

export type SnapshotParser = (
    snapshot: string,
    options?: {
        syntaxHighlighter?: HighlighterExtension,
        htmlSanitizer?: (html: string) => string;
        markdownLinkTarget?: 'blank' | 'self',
        showCodeBlockCopyButton?: boolean;
    },
) => string;
