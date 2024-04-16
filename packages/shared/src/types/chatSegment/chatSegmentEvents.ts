import {Exception} from '../exception';
import {ChatSegment, ChatSegmentEvent} from './chatSegment';
import {AiStreamedMessage, ChatSegmentAiMessage} from './chatSegmentAiMessage';
import {ChatSegmentUserMessage} from './chatSegmentUserMessage';

export type ChatSegmentEventsMap<MessageType> = {
    userMessageReceived: UserMessageReceivedCallback;
    aiMessageReceived: AiMessageReceivedCallback<MessageType>;
    aiMessageStreamStarted: AiMessageStreamStartedCallback;
    aiChunkReceived: AiMessageChunkReceivedCallback;
    aiMessageStreamed: AiMessageStreamedCallback;
    complete: ChatSegmentCompleteCallback<MessageType>;
    exception: ChatSegmentExceptionCallback;
};

export type UserMessageReceivedCallback = (
    userMessage: ChatSegmentUserMessage,
) => void;

export type AiMessageReceivedCallback<MessageType> = (aiMessage: ChatSegmentAiMessage<MessageType> & {
    status: 'complete';
    content: MessageType;
}) => void;

export type AiMessageStreamStartedCallback = (aiMessage: AiStreamedMessage & {
    status: 'streaming';
}) => void;

export type AiMessageStreamedCallback = (aiMessage: AiStreamedMessage & {
    status: 'complete';
}) => void;

export type AiMessageChunkReceivedCallback = (
    messageId: string,
    chunk: string,
) => void;

export type ChatSegmentCompleteCallback<MessageType> = (
    updatedChatSegment: ChatSegment<MessageType>,
) => void;

export type ChatSegmentExceptionCallback = (
    exception: Exception,
    relatedMessageId?: string,
) => void;

//
// Check that the ChatSegmentEventsMap type always satisfies Record<ChatSegmentEvent, Function>
//
type AlwaysSatisfies<T, U> = T extends U ? true : false;
assertAlwaysSatisfies<
    ChatSegmentEventsMap<unknown>,
    Record<ChatSegmentEvent, Function>
>(null as any, true);

function assertAlwaysSatisfies<T, U>(value: T, check: AlwaysSatisfies<T, U>): void {
    // Empty function, used for type checking only
}
