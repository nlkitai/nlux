import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompChatSegmentProps = Readonly<{
    uid: string;
    status: ChatSegmentStatus;
    userPersona?: UserPersona;
    botPersona?: BotPersona;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    streamingAnimationSpeed?: number;
}>;

export type CompChatSegmentElements = {
    chatSegmentContainer: HTMLElement;
    loaderContainer?: HTMLElement;
};

export type CompChatSegmentActions = Readonly<{
    showLoader: () => void;
    hideLoader: () => void;
}>;

export type CompChatSegmentEvents = 'chat-segment-ready' | 'loader-shown' | 'loader-hidden';
