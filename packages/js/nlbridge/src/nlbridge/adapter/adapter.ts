import {
    AdapterExtras,
    DataTransferMode,
    StandardAdapter,
    StandardAdapterConfig,
    StandardAdapterInfo,
    StreamingAdapterObserver,
    uid,
} from '@nlux/core';
import {NlBridgeAdapterOptions} from '../types/adapterOptions';

export abstract class NlBridgeAbstractAdapter implements StandardAdapter<string, string | undefined> {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly __options: NlBridgeAdapterOptions;

    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;

    constructor(options: NlBridgeAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;
        this.__options = {...options};

        this.theDataTransferModeToUse = options.dataTransferMode ?? NlBridgeAbstractAdapter.defaultDataTransferMode;
        this.theEndpointUrlToUse = options.url;
    }

    get config(): StandardAdapterConfig<any, any> {
        return {
            encodeMessage: (message: string) => {
                return Promise.resolve(message);
            },
            decodeMessage: (payload: any) => {
                return Promise.resolve(payload);
            },
        };
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
                textChat: true,
                audio: false,
                fileUpload: false,
            },
            inputFormats: ['text'],
            outputFormats: ['text', 'markdown'],
        };
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
