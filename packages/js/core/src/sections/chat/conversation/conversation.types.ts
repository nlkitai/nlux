import {ChatItem} from '@shared/types/conversation';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../aiChat/sanitizer/sanitizer';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = {
    conversationLayout: ConversationLayout;
    messages?: ChatItem<AiMsg>[];
    assistantPersona?: AssistantPersona;
    userPersona?: UserPersona;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    onSegmentCountChange?: (count: number) => void;
};

export type CompConversationElements = {
    segmentsContainer: HTMLElement;
};

export type CompConversationActions = {
    // No actions
};
