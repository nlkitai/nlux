import {MessageStatus} from '../comp/Message/props';
import {DataTransferMode} from './adapters/chat/chatAdapter';

export type ConversationPartItemType = 'message' | 'stream';

export type ConversationPartAiMessage<MessageType> = {
    uid: string;
    participantRole: 'ai',
    time: Date;
    type: ConversationPartItemType;
    content?: MessageType;
}

export type ConversationPartUserMessage = {
    uid: string;
    participantRole: 'user';
    time: Date;
    content: string;
}

export type ConversationPartItem<MessageType> = ConversationPartAiMessage<MessageType> | ConversationPartUserMessage;

/**
 * The status of a conversation part.
 * - active: The conversation part started and is still ongoing.
 * - error: The conversation part has ended with an error (example: no AI response, or streaming failure).
 * - complete: The conversation part has ended successfully and no more messages will be added to it (example:
 *   streaming is complete, or the AI has finished replying to a user message).
 */
export type ConversationPartStatus = 'active' | 'complete' | 'error';

/**
 * The events that can be emitted by a conversation part.
 * - message: A new message has been added to the conversation part (either from the user or the AI).
 * - update: A message has been updated (example: the AI message has been fully loaded, or message status has changed).
 * - chunk: A new chunk of data has been added to the conversation part (example: streaming data to a message).
 * - complete: The conversation part has ended successfully.
 * - error: The conversation part has ended with an error.
 */
export type ConversationPartEvent = 'update' | 'chunk' | 'complete' | 'error';

export type ConversationPartUpdateCallback = (
    messageId: string,
    newStatus: ConversationPartStatus,
    newContent?: string,
) => void;

export type ConversationPartChunkCallback = (
    messageId: string,
    chunk: string,
) => void;

export type ConversationPartCompleteCallback = () => void;

export type ConversationPartErrorCallback = (
    error: Error,
) => void;

export type ConversationPartEventsMap = {
    update: ConversationPartUpdateCallback;
    chunk: ConversationPartChunkCallback;
    complete: () => void;
    error: (error: Error) => void;
};

/**
 * A conversation is of exchanges between two or more parties.
 * This ConversationPart type represents a single part of a conversation: A single exchange.
 * It can either be a message from a user followed by multiple messages from an AI as a reply,
 * or it can be of set of consecutive messages from an AI agent triggered by an event.
 *
 * A conversation part guarantees the validity of all the messages it contains:
 * For example, if the user sends a message and the AI reply fails, the entire conversation part will be
 * marked as failed.
 *
 */
export type ConversationPart<MessageType> = {
    uid: string;
    status: ConversationPartStatus;
    messages: ConversationPartItem<MessageType>[];
    on: (
        event: ConversationPartEvent,
        callback: ConversationPartEventsMap[ConversationPartEvent],
    ) => void;
    removeListener: (
        event: ConversationPartEvent,
        callback: Function,
    ) => void;
};

/**
 * The handler for a conversation part.
 * This handler is used to control the conversation part and add messages to it. It's the return value of the
 * submitPrompt function and it should be used to add messages to the conversation part, update messages, and
 * control the conversation part lifecycle.
 */
export interface ConversationPartHandler<ResponseType> {
    addUserMessage: (
        status: MessageStatus,
        content?: string,
    ) => string;
    addAiMessage: (
        status: MessageStatus,
        dataTransferMode: DataTransferMode,
        content?: ResponseType
    ) => string,
    updateMessage: (
        id: string,
        status: MessageStatus,
        content?: string,
    ) => void,
    chunk: (chunk: ResponseType) => void,
    complete: () => void,
    error: (error: Error) => void,
}
