import {ChatSegmentAiMessage} from './chatSegmentAiMessage';
import {ChatSegmentUserMessage} from './chatSegmentUserMessage';

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
};

/**
 * The status of a chat segment.
 * - active: The chat segment started and is still ongoing.
 * - error: The chat segment has ended with an error (example: no AI response, or streaming failure).
 * - complete: The chat segment has ended successfully and no more items will be added to it (example:
 *   streaming is complete, or the AI has finished replying to a user message).
 */
export type ChatSegmentStatus = 'active' | 'complete' | 'error';

/**
 * An item in a chat segment can either be:
 * - A message from the user (Type: ChatSegmentUserMessage) — with 'participantRole' set to 'user'.
 * - A message from the AI (Type: ChatSegmentAiMessage<MessageType>) — with 'participantRole' set to 'ai'.
 *
 * System messages are not included in the chat segment items.
 */
export type ChatSegmentItem<MessageType> = ChatSegmentAiMessage<MessageType> | ChatSegmentUserMessage;

/**
 * The events that can be emitted by a chat segment.
 *
 * - userMessageReceived: A message from the user has been received. For new segments triggered by user messages,
 * this event will be emitted first and will contain the user message.
 *
 * - aiMessageReceived: A message from the AI has been fully received. This is only emitted for segments with data
 * transfer mode set to 'fetch', which means the AI sends the entire message at once and not in chunks.
 *
 * - aiMessageStreamStarted: A message from the AI has started streaming. This is only emitted for segments with data
 * transfer mode set to 'stream', and when a message is about to start streaming. This event will be followed by
 * 'aiChunkReceived' events.
 *
 * - aiChunkReceived: A chunk of data from the AI has been received. This is only emitted for segments with data
 * transfer mode set to 'stream', and when a message is being streamed. Multiple 'aiChunkReceived' events can be
 * emitted for a single message.
 *
 * - aiMessageStreamed: A message from the AI has been fully streamed. This is only emitted for segments with data
 * transfer mode set to 'stream', and when a message has been fully streamed.
 *
 * - complete: The chat segment has successfully concluded and no more items will be added or updated.
 *
 * - error: The chat segment has ended with an error.
 *
 */
export type ChatSegmentEvent =
    'userMessageReceived' |
    'aiMessageReceived' |
    'aiMessageStreamStarted' |
    'aiChunkReceived' |
    'aiMessageStreamed' |
    'complete' |
    'exception';
