export type CompChatRoomEvents = 'close-chat-room-clicked'
    | 'show-chat-room-clicked'
    | 'messages-container-clicked';

export type CompChatRoomProps = Readonly<{
    containerMaxHeight?: number;
    visible?: boolean;
    promptBox?: {
        placeholder?: string;
        autoFocus?: boolean;
    }
}>;

export type CompChatRoomElements = Readonly<{
    chatRoomContainer: HTMLElement;
    promptBoxContainer: HTMLElement;
    conversationContainer: HTMLElement;
}>;

export type CompChatRoomActions = Readonly<{}>;
