import {ChatItemProps} from '../../../../../../shared/src/ui/ChatItem/props';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';

export type CompChatItemEvents = 'markdown-stream-complete';

export type CompChatItemProps = {
    uid: string;
    domProps: ChatItemProps;
    syntaxHighlighter?: HighlighterExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
};

export type CompChatItemElements = Readonly<{
    chatItemContainer: HTMLElement;
}>;

export type CompChatItemActions = Readonly<{
    focus: () => void;
    processStreamedChunk: (chunk: string) => void;
    updateMarkdownStreamRenderer: (newProps: Partial<CompChatItemProps>) => void;
    updateDomProps: (oldProps: ChatItemProps, newProps: ChatItemProps) => void;
}>;
