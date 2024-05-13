export type AiStreamedMessage = {
    uid: string;
    time: Date;
    participantRole: 'ai';
    dataTransferMode: 'stream';
} & ({
    status: 'streaming';
} | {
    status: 'complete';
    content: string;
} | {
    status: 'error';
    error: string;
});

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
