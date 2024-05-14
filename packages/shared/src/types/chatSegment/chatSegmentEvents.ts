import {AnyAiMsg} from '../anyAiMsg';
import {NLErrorId} from '../exceptions/errors';
import {ChatSegment, ChatSegmentEvent} from './chatSegment';
import {AiStreamedMessage, ChatSegmentAiMessage} from './chatSegmentAiMessage';
import {ChatSegmentUserMessage} from './chatSegmentUserMessage';

export type ChatSegmentEventsMap<AiMsg> = {
    userMessageReceived: UserMessageReceivedCallback;
    aiMessageReceived: AiMessageReceivedCallback<AiMsg>;
    aiMessageStreamStarted: AiMessageStreamStartedCallback<AiMsg>;
    aiChunkReceived: AiMessageChunkReceivedCallback<AiMsg>;
    aiMessageStreamed: AiMessageStreamedCallback<AiMsg>;
    complete: ChatSegmentCompleteCallback<AiMsg>;
    error: ChatSegmentErrorCallback;
};

export type UserMessageReceivedCallback = (
    userMessage: ChatSegmentUserMessage,
) => void;

export type AiMessageReceivedCallback<AiMsg> = (aiMessage: ChatSegmentAiMessage<AiMsg> & {
    status: 'complete';
    content: AiMsg;
    serverResponse: string | object | undefined;
}) => void;

export type AiMessageStreamStartedCallback<AiMsg> = (aiMessage: AiStreamedMessage<AiMsg> & {
    status: 'streaming';
}) => void;

export type AiMessageStreamedCallback<AiMsg> = (aiMessage: AiStreamedMessage<AiMsg> & {
    status: 'complete';
    content: Array<AiMsg>;
}) => void;

export type AiMessageChunkReceivedCallback<AiMsg> = (chunkData: {
    messageId: string;
    chunk: AiMsg;
    serverResponse?: string | object | undefined;
}) => void;

export type ChatSegmentCompleteCallback<AiMsg> = (
    updatedChatSegment: ChatSegment<AiMsg>,
) => void;

export type ChatSegmentErrorCallback = (
    errorId: NLErrorId,
    errorObject?: Error,
) => void;

//
// Check that the ChatSegmentEventsMap type always satisfies Record<ChatSegmentEvent, function>
// This to ensure that all events in ChatSegmentEvent are covered by a callback function definition.
//
type AlwaysSatisfies<T, U> = T extends U ? true : false;
assertAlwaysSatisfies<
    ChatSegmentEventsMap<AnyAiMsg>,
    Record<ChatSegmentEvent, (...args: never[]) => void>
>({} as ChatSegmentEventsMap<AnyAiMsg>, true);

function assertAlwaysSatisfies<T, U>(value: T, check: AlwaysSatisfies<T, U>): void {
    // Empty function, used for type checking only
}
