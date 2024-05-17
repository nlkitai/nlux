import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {ConversationDisplayMode} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = {
    conversationDisplayMode: ConversationDisplayMode;
    messages?: ChatItem<AiMsg>[];
    botPersona?: BotPersona;
    userPersona?: UserPersona;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    syntaxHighlighter?: HighlighterExtension;
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
