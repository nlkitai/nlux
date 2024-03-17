import {
    AiContext as CoreAiContext,
    ChatAdapterExtras,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
    uid,
} from '@nlux/core';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';

export abstract class NLBridgeAbstractAdapter implements StandardChatAdapter {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly theAiContextToUse: CoreAiContext | undefined = undefined;
    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;

    constructor(options: ChatAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;

        this.theDataTransferModeToUse = options.dataTransferMode ?? NLBridgeAbstractAdapter.defaultDataTransferMode;
        this.theEndpointUrlToUse = options.url;
        this.theAiContextToUse = options.context;
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
