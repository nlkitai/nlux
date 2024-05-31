/**
 * A single item in the conversation.
 * This can be a message from the user, the assistant, or a system message.
 *
 * - `role: 'assistant'`: A message from the assistant (an AI response).
 *    The message type is generic and should match the generic type `AiMsg` used across the component.
 *    The `serverResponse` field is optional and can be used to store the full response received from the server.
 *
 *  - `role: 'user'`: A message from the user.
 *    This is typically a string representing the prompt typed by the user.
 *
 *  - `role: 'system'`: A system message.
 *     This message is not displayed in the UI, but it will be used to when sending the conversation history to the AI.
 */
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

