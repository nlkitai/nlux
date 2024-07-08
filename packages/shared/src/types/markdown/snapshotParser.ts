import {HighlighterExtension} from '../../../../js/core/src/aiChat/highlighter/highlighter';
import {SanitizerExtension} from '../../sanitizer/sanitizer';

export type SnapshotParserOptions = {
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
};

export type SnapshotParser = (
    snapshot: string,
    options?: SnapshotParserOptions,
) => string;
