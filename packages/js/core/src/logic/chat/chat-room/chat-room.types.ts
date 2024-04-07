import {BotPersona, UserPersona} from '../../../core/aiChat/options/personaOptions';
import {ChatItem} from '../../../types/conversation';

export type CompChatRoomEvents = 'chat-room-ready'
    | 'messages-container-clicked';

export type CompChatRoomProps = {
    visible?: boolean;
    botPersona?: BotPersona,
    userPersona?: UserPersona,
    initialConversationContent?: readonly ChatItem[];
    scrollWhenGenerating?: boolean;
    streamingAnimationSpeed?: number | null;
    containerMaxHeight?: number | string;
    containerMaxWidth?: number | string;
    containerHeight?: number | string;
    containerWidth?: number | string;
    promptBox?: {
        placeholder?: string;
        autoFocus?: boolean;
    },
};

export type CompChatRoomElements = {
    chatRoomContainer: HTMLElement;
    promptBoxContainer: HTMLElement;
    conversationContainer: HTMLElement;
};

export type CompChatRoomActions = {};
