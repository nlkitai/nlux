import {ChatItemProps} from '@shared/components/ChatItem/props';
import {SanitizerExtension} from '@shared/sanitizer/sanitizer';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';

export type CompChatItemEvents = 'markdown-stream-complete';

export type CompChatItemProps = {
    uid: string;
    domProps: ChatItemProps;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    waitTimeBeforeStreamCompletion?: number | 'never';
};

export type CompChatItemElements = Readonly<{
    chatItemContainer: HTMLElement;
}>;

export type CompChatItemActions = Readonly<{
    focus: () => void;
    processStreamedChunk: (chunk: string) => void;
    commitStreamedChunks: () => void;
    updateMarkdownStreamRenderer: (newProps: Partial<CompChatItemProps>) => void;
    updateDomProps: (oldProps: ChatItemProps, newProps: ChatItemProps) => void;
}>;
