export type ChatItem<AiMsg = string> = {
    role: 'assistant';
    message: AiMsg;
    serverResponse?: string | object | undefined;
} | {
    role: 'user';
    message: string;
} | {
    role: 'system';
    message: string;
};
