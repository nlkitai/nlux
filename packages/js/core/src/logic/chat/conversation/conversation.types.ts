import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {ChatItem} from '../../../types/conversation';

export type CompConversationEvents = 'user-scrolled';

export type CompConversationScrollParams = Readonly<{
    scrolledToBottom: boolean;
    scrollDirection: 'up' | 'down' | undefined;
}>;

export type CompConversationScrollCallback = (params: CompConversationScrollParams) => void;

export type CompConversationProps = Readonly<{
    messages?: readonly ChatItem[];
    scrollWhenGenerating: boolean;
    streamingAnimationSpeed: number;
    botPersona?: BotPersona;
    userPersona?: UserPersona;
}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{
    scrollToBottom: () => void;
    removeWelcomeMessage: () => void;
    resetWelcomeMessage: () => void;
    updateBotPersona: (newBotPersona: BotPersona | undefined) => void;
    updateUserPersona: (newBotPersona: UserPersona | undefined) => void;
}>;
