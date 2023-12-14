import {
    DataTransferMode,
    StandardAdapter,
    StandardAdapterConfig,
    StandardAdapterInfo,
    StandardAdapterStatus,
    StreamingAdapterObserver,
    warn,
} from '@nlux/core';
import OpenAI from 'openai';
import {gptAdapterInfo} from '../config';
import {OpenAiAdapterOptions} from '../types/adapterOptions';
import {OpenAIModel} from '../types/model';
import {defaultChatGptModel, defaultDataTransferMode} from './config';

export abstract class OpenAiAbstractAdapter<InboundPayload, OutboundPayload> implements StandardAdapter<
    InboundPayload, OutboundPayload
> {
    protected readonly model: OpenAIModel;
    protected readonly openai: OpenAI;
    protected readonly theDataTransferMode: DataTransferMode;
    protected currentStatus: StandardAdapterStatus = 'disconnected';
    protected systemMessage: string | null = 'Act as a helpful assistant to the user';

    protected constructor({
        systemMessage,
        apiKey,
        dataTransferMode,
        model,
    }: OpenAiAdapterOptions) {
        this.currentStatus = 'disconnected';
        this.theDataTransferMode = dataTransferMode ?? defaultDataTransferMode;
        this.model = model ?? defaultChatGptModel;

        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true,
        });

        if (systemMessage) {
            this.systemMessage = systemMessage;
        }

        warn('OpenAI GPT adapter has been initialized in browser mode using option "dangerouslyAllowBrowser". '
            + 'This is not recommended for production use. We recommend that you implement a server-side proxy '
            + 'and configure a customized adapter for it. Read more at '
            + 'https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety');
    }

    abstract get config(): StandardAdapterConfig<InboundPayload, OutboundPayload>;

    get dataTransferMode(): DataTransferMode {
        return this.theDataTransferMode;
    }

    get id() {
        return this.info.id;
    }

    get info(): StandardAdapterInfo {
        return gptAdapterInfo;
    }

    get status(): StandardAdapterStatus {
        return this.currentStatus;
    }

    async decode(payload: InboundPayload): Promise<string> {
        const {decodeMessage} = this.config;
        return decodeMessage(payload);
    }

    async encode(message: string): Promise<OutboundPayload> {
        const {encodeMessage} = this.config;
        return encodeMessage(message);
    }

    abstract fetchText(message: string): Promise<string>;

    abstract streamText(message: string, observer: StreamingAdapterObserver): void;
}
