import {MessageStatus} from '../ui/Message/props';
import {DataTransferMode} from './adapters/chat/chatAdapter';

export type AiStreamedMessageStatus = 'streaming' | 'complete' | 'error';
export type AiStreamedMessage = {
    uid: string;
    time: Date;
    status: AiStreamedMessageStatus;
    participantRole: 'ai';
    dataTransferMode: 'stream';
};

export type AiUnifiedMessage<MessageType> = {
    uid: string;
    time: Date;
    participantRole: 'ai';
    dataTransferMode: 'fetch';
} & ({
    status: 'complete';
    content: MessageType;
} | {
    status: 'error';
    error: string;
} | {
    status: 'loading';
});

export type ChatSegmentAiMessage<MessageType> = AiStreamedMessage | AiUnifiedMessage<MessageType>;
export type ChatSegmentUserMessage = {
    uid: string;
    time: Date;
    status: 'complete';
    participantRole: 'user';
    content: string;
}

export type ChatSegmentItem<MessageType> = ChatSegmentAiMessage<MessageType> | ChatSegmentUserMessage;

/**
 * The status of a chat segment.
 * - active: The chat segment started and is still ongoing.
 * - error: The chat segment has ended with an error (example: no AI response, or streaming failure).
 * - complete: The chat segment has ended successfully and no more items will be added to it (example:
 *   streaming is complete, or the AI has finished replying to a user message).
 */
export type ChatSegmentStatus = 'active' | 'complete' | 'error';

/**
 * The events that can be emitted by a chat segment.
 * - message: A new message has been added to the chat segment (either from the user or the AI).
 * - update: A message has been updated (example: the AI message has been fully loaded, or message status has changed).
 * - chunk: A new chunk of data has been added to the chat segment (example: streaming data to a message).
 * - complete: The chat segment has ended successfully.
 * - error: The chat segment has ended with an error.
 */
export type ChatSegmentEvent = 'update' | 'chunk' | 'complete' | 'error';

export type ChatSegmentUpdateCallback<MessageType> = (
    updatedChatSegment: ChatSegment<MessageType>,
) => void;

export type ChatSegmentChunkCallback = (
    messageId: string,
    chunk: string,
) => void;

export type ChatSegmentCompleteCallback<MessageType> = (
    updatedChatSegment: ChatSegment<MessageType>,
) => void;

export type ChatSegmentErrorCallback = (
    error: Error,
) => void;

export type ChatSegmentEventsMap<MessageType> = {
    update: ChatSegmentUpdateCallback<MessageType>;
    complete: ChatSegmentCompleteCallback<MessageType>;
    chunk: ChatSegmentChunkCallback;
    error: (error: Error) => void;
};

/**
 * A conversation is series of exchanges of items between multiple participants.
 * This ChatSegment type represents a single exchange of items.
 * It can either be a message from a user followed by multiple items from an AI as a reply,
 * or it can be of set of consecutive items from an AI agent triggered by an event.
 *
 * A chat segment guarantees the validity of all the items it contains:
 * For example, if the user sends a message and the AI reply fails, the entire chat segment will be
 * marked as failed.
 *
 */
export type ChatSegment<MessageType> = {
    uid: string;
    status: ChatSegmentStatus;
    items: ChatSegmentItem<MessageType>[];
    on: <EventType extends ChatSegmentEvent>(
        event: EventType,
        callback: ChatSegmentEventsMap<MessageType>[EventType],
    ) => void;
    removeListener: <EventType extends ChatSegmentEvent>(
        event: EventType,
        callback: ChatSegmentEventsMap<MessageType>[EventType],
    ) => void;
};

/**
 * The handler for a chat segment.
 * This handler is used to control the chat segment and add items to it. It's the return value of the
 * submitPrompt function, and it should be used to add items to the chat segment, update items, and
 * control the chat segment lifecycle.
 */
export interface ChatSegmentHandler<ResponseType> {
    addAiMessage: (
        status: MessageStatus,
        dataTransferMode: DataTransferMode,
        content?: ResponseType,
    ) => string,
    addUserMessage: (
        status: MessageStatus,
        content?: string,
    ) => string;
    chunk: (chunk: ResponseType) => void,
    complete: () => void,
    error: (error: Error) => void,
    updateMessage: (
        id: string,
        status: MessageStatus,
        content?: string,
    ) => void,
}
