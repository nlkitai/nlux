import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = Readonly<{
    messages?: readonly ChatItem<AiMsg>[];
    botPersona?: BotPersona;
    userPersona?: UserPersona;
    openLinksInNewWindow?: boolean;
    skipAnimation?: boolean;
    streamingAnimationSpeed?: number;
    syntaxHighlighter?: HighlighterExtension;
}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{
    removeWelcomeMessage: () => void;
    resetWelcomeMessage: () => void;
    updateBotPersona: (newBotPersona: BotPersona | undefined) => void;
    updateUserPersona: (newBotPersona: UserPersona | undefined) => void;
}>;
