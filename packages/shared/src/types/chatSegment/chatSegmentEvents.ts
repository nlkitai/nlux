import {AnyAiMsg} from '../anyAiMsg';
import {CallbackFunction} from '../callbackFunction';
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
    content: string;
}) => void;

export type AiMessageChunkReceivedCallback = (
    chunk: string,
    messageId: string,
) => void;

export type ChatSegmentCompleteCallback<AiMsg> = (
    updatedChatSegment: ChatSegment<AiMsg>,
) => void;

export type ChatSegmentErrorCallback = (
    errorId: NLErrorId,
    errorObject?: Error,
) => void;

//
// Check that the ChatSegmentEventsMap type always satisfies Record<ChatSegmentEvent, CallbackFunction>
//
type AlwaysSatisfies<T, U> = T extends U ? true : false;
assertAlwaysSatisfies<
    ChatSegmentEventsMap<AnyAiMsg>,
    Record<ChatSegmentEvent, CallbackFunction>
>(null, true);

function assertAlwaysSatisfies<T, U>(value: T, check: AlwaysSatisfies<T, U>): void {
    // Empty function, used for type checking only
}
