import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompConversationEvents = void;

export type CompConversationProps<AiMsg> = Readonly<{
    messages?: readonly ChatItem<AiMsg>[];
    streamingAnimationSpeed: number;
    botPersona?: BotPersona;
    userPersona?: UserPersona;
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
