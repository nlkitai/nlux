import {
    ChatAdapterExtras,
    ChatItem,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
} from '@nlux/core';
import {uid} from '../../../../../shared/src/utils/uid';
import {warn} from '../../../../../shared/src/utils/warn';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeHeaders} from '../types/langServe';
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

    abstract fetchText(message: string, extras: ChatAdapterExtras<AiMsg>): Promise<AiMsg>;

    init() {
        if (!this.inputPreProcessor && this.useInputSchema) {
            this.fetchSchema(this.inputSchemaUrl).then((schema) => {
                this.theInputSchemaToUse = schema;
            });
        }
    }

    abstract streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<AiMsg>): void;

    protected getDisplayableMessageFromAiOutput(aiMessage: object | string): AiMsg {
        if (this.outputPreProcessor) {
            return this.outputPreProcessor(aiMessage);
        }

        return aiMessage as AiMsg;
    }

    protected getRequestBody(message: string, conversationHistory?: ChatItem<AiMsg>[]): string {
        if (this.inputPreProcessor) {
            const preProcessedInput = this.inputPreProcessor(message, conversationHistory);
            return JSON.stringify({
                input: preProcessedInput,
            });
        }

        if (this.inputSchema) {
            const body = transformInputBasedOnSchema(message, conversationHistory, this.inputSchema, this.runnableName);
            if (typeof body !== 'undefined') {
                return JSON.stringify({
                    input: body,
                });
            }
        }

        // By default, we send the message as is
        return JSON.stringify({
            input: message,
        });
    }
}
