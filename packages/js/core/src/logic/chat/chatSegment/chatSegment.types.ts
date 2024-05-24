import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../exports/aiChat/sanitizer/sanitizer';

export type CompChatSegmentProps = Readonly<{
    uid: string;
    status: ChatSegmentStatus;
    conversationLayout: ConversationLayout;
    userPersona?: UserPersona;
    botPersona?: BotPersona;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
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
