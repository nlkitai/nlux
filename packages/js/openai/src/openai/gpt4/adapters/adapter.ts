import {AdapterConfig, AdapterInfo, AdapterStatus, ISseAdapter, Message, Observable} from '@nlux/nlux';
import OpenAI from 'openai';
import {gpt4AdapterInfo} from '../config';

export abstract class Gpt4AbstractAdapter<InboundPayload, OutboundPayload> implements ISseAdapter<
    InboundPayload, OutboundPayload
> {
    protected actAsMessage: string | null = 'Act as a helpful assistant to the user';
    protected currentStatus: AdapterStatus = 'disconnected';
    protected readonly dataExchangeMode: 'stream' | 'fetch' = 'fetch';
    protected readonly historyDepthToInclude: number | 'max';
    protected readonly openai: OpenAI;
    protected readonly timeout;

    protected constructor({
        actAs,
        apiKey,
        timeout,
        historyDepthToInclude,
        dataExchangeMode,
    }: {
        actAs?: string;
        apiKey: string;
        timeout: number,
        historyDepthToInclude: number | 'max',
        dataExchangeMode: 'stream' | 'fetch',
    }) {
        this.currentStatus = 'disconnected';
        this.historyDepthToInclude = historyDepthToInclude ?? 2;
        this.timeout = timeout;
        this.dataExchangeMode = dataExchangeMode;

        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true,
        });

        if (actAs) {
            this.actAsMessage = actAs;
        }

        console.warn('GPT-4 adapter has been initialized in browser mode using option "dangerouslyAllowBrowser". '
            + 'This is not recommended for production use. We recommend that you implement a server-side proxy '
            + 'and configure a customized adapter for it. Read more at '
            + 'https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety');
    }

    abstract get config(): AdapterConfig<InboundPayload, OutboundPayload>;

    get id() {
        return this.info.id;
    }

    get info(): AdapterInfo {
        return gpt4AdapterInfo;
    }

    get status(): AdapterStatus {
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

    abstract send(message: Message): Observable<Message>;
}
