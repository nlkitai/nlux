export type AiStreamedMessage = {
    uid: string;
    time: Date;
    status: 'streaming' | 'complete' | 'error';
    participantRole: 'ai';
    dataTransferMode: 'stream';
};

export type AiStreamedMessageStatus = AiStreamedMessage['status'];

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

export type AiUnifiedMessageStatus = AiUnifiedMessage<unknown>['status'];

export type ChatSegmentAiMessage<MessageType> = AiStreamedMessage | AiUnifiedMessage<MessageType>;
