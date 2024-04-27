import {ChatItemProps} from '../../../../../../shared/src/ui/ChatItem/props';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';

export type CompChatItemEvents = 'markdown-stream-complete';

export type CompChatItemProps = {
    uid: string;
    domProps: ChatItemProps;
    openMdLinksInNewWindow?: boolean;
    skipAnimation?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    streamingAnimationSpeed?: number;
};

export type CompChatItemElements = Readonly<{
    chatItemContainer: HTMLElement;
}>;

export type CompChatItemActions = Readonly<{
    focus: () => void;
    processStreamedChunk: (chunk: string) => void;
    updateMarkdownStreamRenderer: (newProps: Partial<CompChatItemProps>) => void;
}>;
