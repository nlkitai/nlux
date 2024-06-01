import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../aiChat/sanitizer/sanitizer';

export type CompChatSegmentProps = Readonly<{
    uid: string;
    status: ChatSegmentStatus;
    conversationLayout: ConversationLayout;
    userPersona?: UserPersona;
    assistantPersona?: AssistantPersona;
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
