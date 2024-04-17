import {NLErrorId} from '../exceptions/errors';
import {ChatSegment, ChatSegmentEvent} from './chatSegment';
import {AiStreamedMessage, ChatSegmentAiMessage} from './chatSegmentAiMessage';
import {ChatSegmentUserMessage} from './chatSegmentUserMessage';

export type ChatSegmentEventsMap<AiMsg> = {
    userMessageReceived: UserMessageReceivedCallback;
    aiMessageReceived: AiMessageReceivedCallback<AiMsg>;
    aiMessageStreamStarted: AiMessageStreamStartedCallback;
    aiChunkReceived: AiMessageChunkReceivedCallback;
    aiMessageStreamed: AiMessageStreamedCallback;
    complete: ChatSegmentCompleteCallback<AiMsg>;
    error: ChatSegmentErrorCallback;
};

export type UserMessageReceivedCallback = (
    userMessage: ChatSegmentUserMessage,
) => void;

export type AiMessageReceivedCallback<AiMsg> = (aiMessage: ChatSegmentAiMessage<AiMsg> & {
    status: 'complete';
    content: AiMsg;
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

export type ChatSegmentCompleteCallback<AiMsg> = (
    updatedChatSegment: ChatSegment<AiMsg>,
) => void;

export type ChatSegmentErrorCallback = (
    errorId: NLErrorId,
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
