export type ChatItem<AiMsg = string> = {
    role: 'ai';
    message: AiMsg;
} | {
    role: 'user';
    message: string;
} | {
    role: 'system';
    message: string;
};

