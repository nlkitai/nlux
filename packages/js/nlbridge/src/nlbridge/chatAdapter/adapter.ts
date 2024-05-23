import {
    AiContext as CoreAiContext,
    ChatAdapterExtras,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
} from '@nlux/core';
import {uid} from '../../../../../shared/src/utils/uid';
import {warn} from '../../../../../shared/src/utils/warn';
import {ChatAdapterOptions, ChatAdapterUsageMode} from '../types/chatAdapterOptions';

export abstract class NLBridgeAbstractAdapter<AiMsg> implements StandardChatAdapter<AiMsg> {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly theAiContextToUse: CoreAiContext | undefined = undefined;
    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;
    private readonly theHeaders: Record<string, string>;
    private readonly theUsageMode: ChatAdapterUsageMode | undefined = undefined;

    protected constructor(options: ChatAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;

        this.theUsageMode = options.mode;
        this.theEndpointUrlToUse = options.url;
        this.theAiContextToUse = options.context;
        this.theDataTransferModeToUse = options.mode === 'copilot' && options.context ? 'fetch' : 'stream';
        this.theHeaders = options.headers ?? {};
    }

    get context(): CoreAiContext | undefined {
        return this.theAiContextToUse;
    }

    get dataTransferMode(): DataTransferMode {
        return this.theDataTransferModeToUse;
    }

    get endpointUrl(): string {
        return this.theEndpointUrlToUse;
    }

    get headers(): Record<string, string> {
        return this.theHeaders;
    }

    get id(): string {
        return this.__instanceId;
    }

    get info(): StandardAdapterInfo {
        return {
            id: 'nlbridge-adapter',
            capabilities: {
                chat: true,
                fileUpload: false,
                textToSpeech: false,
                speechToText: false,
            },
        };
    }

    get usageMode(): ChatAdapterUsageMode | undefined {
        return this.theUsageMode;
    }

    abstract fetchText(
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ): Promise<string | object | undefined>;

    preProcessAiStreamedChunk(chunk: string | object | undefined, extras: ChatAdapterExtras<AiMsg>): AiMsg | undefined {
        if (typeof chunk === 'string') {
            return chunk as AiMsg;
        }

        warn('NLBridge adapter received a non-string chunk from the server. Returning empty string.');
        return '' as AiMsg;
    }

    preProcessAiBatchedMessage(message: string | object | undefined, extras: ChatAdapterExtras<AiMsg>): AiMsg | undefined {
        if (typeof message === 'string') {
            return message as AiMsg;
        }

        warn('NLBridge adapter received a non-string message from the server. Returning empty string.');
        return '' as AiMsg;
    }

    abstract streamText(
        message: string,
        observer: StreamingAdapterObserver<string | object | undefined>,
        extras: ChatAdapterExtras<AiMsg>,
    ): void;
}
