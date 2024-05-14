export type AiStreamedMessage<AiMsg> = {
    uid: string;
    time: Date;
    participantRole: 'ai';
    dataTransferMode: 'stream';
} & ({
    status: 'streaming';
} | {
    status: 'complete';

    // For streamed messages, AiMsg is used for both chunks and the final message pre-processed by the adapter.
    // For strings, this is straightforward. For objects, the adapter must pre-process the final message passed
    // through complete() to match the AiMsg type.
    content: Array<AiMsg>;

    // Chunks streamed from the AI. Only available for standard adapters.
    serverResponse: Array<string | object | undefined> | undefined;
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

    // The raw response from the AI. Only available for standard adapters.
    serverResponse: string | object | undefined;
} | {
    status: 'error';
    error: string;
} | {
    status: 'loading';
});

export type ChatSegmentAiMessage<AiMsg> = AiStreamedMessage<AiMsg> | AiUnifiedMessage<AiMsg>;
