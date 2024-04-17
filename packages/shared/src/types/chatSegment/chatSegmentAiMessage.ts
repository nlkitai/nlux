export type AiStreamedMessage = {
    uid: string;
    time: Date;
    status: 'streaming' | 'complete' | 'error';
    participantRole: 'ai';
    dataTransferMode: 'stream';
};

export type AiStreamedMessageStatus = AiStreamedMessage['status'];

export type AiUnifiedMessage<AiMsg> = {
    uid: string;
    time: Date;
    participantRole: 'ai';
    dataTransferMode: 'fetch';
} & ({
    status: 'complete';
    content: AiMsg;
} | {
    status: 'error';
    error: string;
} | {
    status: 'loading';
});

export type ChatSegmentAiMessage<AiMsg> = AiStreamedMessage | AiUnifiedMessage<AiMsg>;
