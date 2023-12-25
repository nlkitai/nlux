import {BotPersona, UserPersona} from '../../../core/options/personaOptions';

export type CompChatRoomEvents = 'close-chat-room-clicked'
    | 'show-chat-room-clicked'
    | 'messages-container-clicked';

export type CompChatRoomProps = {
    visible?: boolean;
    botPersona?: BotPersona,
    userPersona?: UserPersona,
    scrollWhenGenerating?: boolean;
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
