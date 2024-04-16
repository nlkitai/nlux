import {PromptBoxProps} from '../../../../../../shared/src/ui/PromptBox/props';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {ChatItem} from '../../../types/conversation';

export type CompChatRoomEvents = 'chat-room-ready'
    | 'messages-container-clicked';

export type CompChatRoomProps<AiMsg> = {
    visible?: boolean;
    botPersona?: BotPersona,
    userPersona?: UserPersona,
    initialConversationContent?: readonly ChatItem<AiMsg>[];
    scrollWhenGenerating?: boolean;
    streamingAnimationSpeed?: number | null;
    promptBox: Partial<PromptBoxProps>;
};

export type CompChatRoomElements = {
    chatRoomContainer: HTMLElement;
    promptBoxContainer: HTMLElement;
    conversationContainer: HTMLElement;
};

export type CompChatRoomActions = {};
