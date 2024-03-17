import {
    AiContext as CoreAiContext,
    ChatAdapterExtras,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
    uid,
} from '@nlux/core';
import {ChatAdapterOptions, ChatAdapterUsageMode} from '../types/chatAdapterOptions';

export abstract class NLBridgeAbstractAdapter implements StandardChatAdapter {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly theAiContextToUse: CoreAiContext | undefined = undefined;
    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;
    private readonly theUsageMode: ChatAdapterUsageMode | undefined = undefined;

    protected constructor(options: ChatAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;

        this.theUsageMode = options.mode;
        this.theEndpointUrlToUse = options.url;
        this.theAiContextToUse = options.context;
        this.theDataTransferModeToUse = options.mode === 'copilot' && options.context ? 'fetch' : 'stream';
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
        extras: ChatAdapterExtras,
    ): Promise<string>;

    abstract streamText(
        message: string,
        observer: StreamingAdapterObserver,
        extras: ChatAdapterExtras,
    ): void;
}
