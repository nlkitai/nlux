export type ChatItem<AiMsg = string> = {
    role: 'ai';
    message: AiMsg;
    serverResponse?: string | object | undefined;
} | {
    role: 'user';
    message: string;
} | {
    role: 'system';
    message: string;
};
