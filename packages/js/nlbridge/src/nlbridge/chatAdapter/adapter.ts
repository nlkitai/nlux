import {
    AdapterExtras,
    AiTaskRunner,
    DataTransferMode,
    StandardAdapter,
    StandardAdapterInfo,
    StreamingAdapterObserver,
    uid,
} from '@nlux/core';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';

export abstract class NlBridgeAbstractAdapter implements StandardAdapter {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly theContextIdToUse: string | undefined;
    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;
    private readonly theTaskRunnerToUse: AiTaskRunner | undefined;

    constructor(options: ChatAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;

        this.theDataTransferModeToUse = options.dataTransferMode ?? NlBridgeAbstractAdapter.defaultDataTransferMode;
        this.theEndpointUrlToUse = options.url;
        this.theContextIdToUse = options.contextId;
        this.theTaskRunnerToUse = options.taskRunner;
    }

    get contextId(): string | undefined {
        return this.theContextIdToUse;
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

    get taskRunner(): AiTaskRunner | undefined {
        return this.theTaskRunnerToUse;
    }

    async decode(payload: string): Promise<string | undefined> {
        return undefined;
    }

    async encode(message: string): Promise<string | undefined> {
        return undefined;
    }

    abstract fetchText(message: string, extras: AdapterExtras): Promise<string>;

    abstract streamText(message: string, observer: StreamingAdapterObserver, extras: AdapterExtras): void;
}
