import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = {
    messages?: ChatItem<AiMsg>[];
    botPersona?: BotPersona;
    userPersona?: UserPersona;
    openMdLinksInNewWindow?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    syntaxHighlighter?: HighlighterExtension;
};

export type CompConversationElements = {
    messagesContainer: HTMLElement;
};

export type CompConversationActions = {
    removeWelcomeMessage: () => void;
    resetWelcomeMessage: () => void;
    updateBotPersona: (newBotPersona: BotPersona | undefined) => void;
    updateUserPersona: (newBotPersona: UserPersona | undefined) => void;
};
