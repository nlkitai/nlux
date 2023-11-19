import {
    Message,
    NluxAdapter,
    NluxAdapterConfig,
    NluxAdapterInfo,
    NluxAdapterStatus,
    StreamingAdapterObserver,
} from '@nlux/nlux';
import OpenAI from 'openai';
import {warn} from '../../../x/debug';
import {gptAdapterInfo} from '../config';
import {OpenAIChatModel} from '../types/models';

export abstract class GptAbstractAdapter<InboundPayload, OutboundPayload> implements NluxAdapter<
    InboundPayload, OutboundPayload
> {
    protected readonly dataExchangeMode: 'stream' | 'fetch' = 'fetch';
    protected readonly model: OpenAIChatModel;
    protected readonly openai: OpenAI;
    protected currentStatus: NluxAdapterStatus = 'disconnected';
    protected initialSystemMessage: string | null = 'Act as a helpful assistant to the user';

    protected constructor({
        initialSystemMessage,
        apiKey,
        dataExchangeMode,
        model,
    }: {
        initialSystemMessage?: string;
        apiKey: string;
        dataExchangeMode: 'stream' | 'fetch',
        model: OpenAIChatModel,
    }) {
        this.currentStatus = 'disconnected';
        this.dataExchangeMode = dataExchangeMode;

        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true,
        });

        this.model = model;

        if (initialSystemMessage) {
            this.initialSystemMessage = initialSystemMessage;
        }

        warn('OpenAI GPT adapter has been initialized in browser mode using option "dangerouslyAllowBrowser". '
            + 'This is not recommended for production use. We recommend that you implement a server-side proxy '
            + 'and configure a customized adapter for it. Read more at '
            + 'https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety');
    }

    abstract get config(): NluxAdapterConfig<InboundPayload, OutboundPayload>;

    get id() {
        return this.info.id;
    }

    get info(): NluxAdapterInfo {
        return gptAdapterInfo;
    }

    get status(): NluxAdapterStatus {
        return this.currentStatus;
    }


    async decode(payload: InboundPayload): Promise<Message> {
        const {decodeMessage} = this.config;
        return decodeMessage(payload);
    }

    async encode(message: Message): Promise<OutboundPayload> {
        const {encodeMessage} = this.config;
        return encodeMessage(message);
    }

    abstract send(message: Message, observer: StreamingAdapterObserver): void;
}
