import {ChatItem} from '@shared/types/conversation';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../aiChat/sanitizer/sanitizer';
import {ConversationStarter} from '../../../types/conversationStarter';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = {
    conversationLayout: ConversationLayout;
    messages?: ChatItem<AiMsg>[];
    assistantPersona?: AssistantPersona;
    userPersona?: UserPersona;
    showWelcomeMessage?: boolean;
    conversationStarters?: ConversationStarter[];
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    onConversationStarterClick: (conversationStarter: ConversationStarter) => void;
};

export type CompConversationElements = {
    segmentsContainer: HTMLElement;
    conversationStartersContainer: HTMLElement;
};

export type CompConversationActions = {
    removeWelcomeMessage: () => void;
    resetWelcomeMessage: () => void;
    updateAssistantPersona: (newAssistantPersona: AssistantPersona | undefined) => void;
    updateUserPersona: (newUserPersona: UserPersona | undefined) => void;
};
