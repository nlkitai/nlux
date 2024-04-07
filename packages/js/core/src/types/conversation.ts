export type ChatItem<MessageType = string> = {
    role: 'ai';
    message: MessageType;
} | {
    role: 'user';
    message: string;
} | {
    role: 'system';
    message: string;
};

