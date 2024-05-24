import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../exports/aiChat/sanitizer/sanitizer';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = {
    conversationLayout: ConversationLayout;
    messages?: ChatItem<AiMsg>[];
    botPersona?: BotPersona;
    userPersona?: UserPersona;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
};

export type CompConversationElements = {
    segmentsContainer: HTMLElement;
};

export type CompConversationActions = {
    removeWelcomeMessage: () => void;
    resetWelcomeMessage: () => void;
    updateBotPersona: (newBotPersona: BotPersona | undefined) => void;
    updateUserPersona: (newUserPersona: UserPersona | undefined) => void;
};
