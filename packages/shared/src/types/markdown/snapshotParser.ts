import {HighlighterExtension} from '../../../../js/core/src/exports/aiChat/highlighter/highlighter';
import {SanitizerExtension} from '../../../../js/core/src/exports/aiChat/sanitizer/sanitizer';

export type SnapshotParserOptions = {
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
};

export type SnapshotParser = (
    snapshot: string,
    options?: {
        syntaxHighlighter?: HighlighterExtension,
        htmlSanitizer?: SanitizerExtension;
        markdownLinkTarget?: 'blank' | 'self',
        showCodeBlockCopyButton?: boolean;
    },
) => string;
