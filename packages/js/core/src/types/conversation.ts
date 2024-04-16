export type ChatItem<AiMsg> = {
    role: 'ai';
    message: AiMsg;
} | {
    role: 'user';
    message: string;
} | {
    role: 'system';
    message: string;
};
