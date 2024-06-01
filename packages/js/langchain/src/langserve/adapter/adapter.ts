import {
    ChatAdapterExtras,
    ChatItem,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
} from '@nlux/core';
import {uid} from '@shared/utils/uid';
import {warn} from '@shared/utils/warn';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeConfig, LangServeHeaders} from '../types/langServe';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';
import {getDataTransferModeToUse} from '../utils/getDataTransferModeToUse';
import {getEndpointUrlToUse} from '../utils/getEndpointUrlToUse';
import {getHeadersToUse} from '../utils/getHeadersToUse';
import {getRunnableNameToUse} from '../utils/getRunnableNameToUse';
import {getSchemaUrlToUse} from '../utils/getSchemaUrlToUse';
import {transformInputBasedOnSchema} from '../utils/transformInputBasedOnSchema';

export abstract class LangServeAbstractAdapter<AiMsg> implements StandardChatAdapter<AiMsg> {
    static defaultDataTransferMode: DataTransferMode = 'stream';

    private readonly __instanceId: string;
    private readonly __options: ChatAdapterOptions<AiMsg>;

    private readonly theDataTransferModeToUse: DataTransferMode;
    private readonly theEndpointUrlToUse: string;
    private readonly theHeadersToUse: LangServeHeaders;
    private theInputSchemaToUse: object | undefined;
    private readonly theInputSchemaUrlToUse: string;
    private readonly theRunnableNameToUse: string;
    private readonly theUseInputSchemaOptionToUse: boolean;

    protected constructor(options: ChatAdapterOptions<AiMsg>) {
        this.__instanceId = `${this.info.id}-${uid()}`;
        this.__options = {...options};

        this.theDataTransferModeToUse = getDataTransferModeToUse(options);
        this.theHeadersToUse = getHeadersToUse(options);
        this.theUseInputSchemaOptionToUse = (typeof options.useInputSchema === 'boolean')
            ? options.useInputSchema
            : true;

        this.theEndpointUrlToUse = getEndpointUrlToUse(options);
        this.theRunnableNameToUse = getRunnableNameToUse(options);
        this.theInputSchemaUrlToUse = getSchemaUrlToUse(options, 'input');

        this.init();
    }

    get dataTransferMode(): DataTransferMode {
        return this.theDataTransferModeToUse;
    }

    get endpointUrl(): string {
        return this.theEndpointUrlToUse;
    }

    get headers(): LangServeHeaders {
        return this.theHeadersToUse;
    }

    get id(): string {
        return this.__instanceId;
    }

    get info(): StandardAdapterInfo {
        return {
            id: 'langserve-adapter',
            capabilities: {
                chat: true,
                fileUpload: false,
                textToSpeech: false,
                speechToText: false,
            },
        };
    }

    get inputPreProcessor(): LangServeInputPreProcessor<AiMsg> | undefined {
        return this.__options.inputPreProcessor;
    }

    get inputSchema(): Readonly<object> | undefined {
        return this.theInputSchemaToUse;
    }

    get outputPreProcessor(): LangServeOutputPreProcessor<AiMsg> | undefined {
        return this.__options.outputPreProcessor;
    }

    get runnableName(): string {
        return this.theRunnableNameToUse;
    }

    get useInputSchema(): boolean {
        return this.theUseInputSchemaOptionToUse;
    }

    protected get config(): LangServeConfig | undefined {
        return this.__options.config;
    }

    private get inputSchemaUrl(): string {
        return this.theInputSchemaUrlToUse;
    }

    async fetchSchema(url: string): Promise<object | undefined> {
        try {
            const response = await fetch(url);
            const result = await response.json();
            if (typeof result !== 'object' || !result) {
                warn(`LangServe adapter is unable process schema loaded from: ${url}`);
                return undefined;
            }

            return result;
        } catch (_error) {
            warn(`LangServe adapter is unable to fetch schema from: ${url}`);
            return undefined;
        }
    }

    abstract batchText(message: string, extras: ChatAdapterExtras<AiMsg>): Promise<string | object | undefined>;

    init() {
        if (this.useInputSchema) {
            this.fetchSchema(this.inputSchemaUrl).then((schema) => {
                this.theInputSchemaToUse = schema;
            });
        }
    }

    preProcessAiStreamedChunk(
        chunk: string | object | undefined,
        extras: ChatAdapterExtras<AiMsg>,
    ): AiMsg | undefined {
        if (this.outputPreProcessor) {
            return this.outputPreProcessor(chunk);
        }

        if (typeof chunk === 'string') {
            return chunk as AiMsg;
        }

        const content = (chunk as Record<string, unknown>)?.content;
        if (typeof content === 'string') {
            return content as AiMsg;
        }

        warn(
            'LangServe adapter is unable to process the chunk from the runnable. Returning empty string. ' +
            'You may want to implement an output pre-processor to handle chunks of custom responses.',
        );

        return undefined;
    }

    preProcessAiBatchedMessage(
        message: string | object | undefined,
        extras: ChatAdapterExtras<AiMsg>,
    ): AiMsg | undefined {
        if (this.outputPreProcessor) {
            return this.outputPreProcessor(message);
        }

        if (typeof message === 'string') {
            return message as AiMsg;
        }

        const content = (message as Record<string, unknown>)?.content;
        if (typeof content === 'string') {
            return content as AiMsg;
        }

        warn(
            'LangServe adapter is unable to process the response from the runnable. Returning empty string. ' +
            'You may want to implement an output pre-processor to handle custom responses.',
        );

        return undefined;
    }

    abstract streamText(
        message: string,
        observer: StreamingAdapterObserver<string | object | undefined>,
        extras: ChatAdapterExtras<AiMsg>,
    ): void;

    protected getRequestBody(
        message: string,
        config?: Record<string, unknown>,
        conversationHistory?: ChatItem<AiMsg>[],
    ): string {
        if (this.inputPreProcessor) {
            const preProcessedInput = this.inputPreProcessor(message, conversationHistory);
            return JSON.stringify({
                input: preProcessedInput,
                config,
            });
        }

        if (this.inputSchema) {
            const body = transformInputBasedOnSchema(message, conversationHistory, this.inputSchema, this.runnableName);
            if (typeof body !== 'undefined') {
                return JSON.stringify({
                    input: body,
                    config,
                });
            }
        }

        // By default, we send the message as is
        return JSON.stringify({
            input: message,
            config,
        });
    }
}
