import {ChatSegment} from './chatSegment';
import {AiStreamedMessage, ChatSegmentAiMessage} from './chatSegmentAiMessage';
import {ChatSegmentUserMessage} from './chatSegmentUserMessage';

export type ChatSegmentEventsMap<MessageType> = {
    userMessageReceived: UserMessageReceivedCallback;
    aiMessageReceived: AiMessageReceivedCallback<MessageType>;
    aiMessageStreamStarted: AiMessageStreamStartedCallback;
    aiChunkReceived: AiMessageChunkReceivedCallback;
    aiMessageStreamed: AiMessageStreamedCallback;
    complete: ChatSegmentCompleteCallback<MessageType>;
    error: ChatSegmentErrorCallback;
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

export type ChatSegmentErrorCallback = (
    error: Error,
    relatedMessageId?: string,
) => void;
