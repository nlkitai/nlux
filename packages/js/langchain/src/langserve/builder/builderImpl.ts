import {DataTransferMode} from '@nlux/core';
import {NluxUsageError} from '../../../../../shared/src/types/error';
import {LangServeAbstractAdapter} from '../adapter/adapter';
import {LangServeBatchAdapter} from '../adapter/batch';
import {LangServeStreamAdapter} from '../adapter/stream';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeHeaders} from '../types/langServe';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';
import {getDataTransferModeToUse} from '../utils/getDataTransferModeToUse';
import {ChatAdapterBuilder} from './builder';

export class LangServeAdapterBuilderImpl<AiMsg> implements ChatAdapterBuilder<AiMsg> {
    private theDataTransferMode?: DataTransferMode;
    private theHeaders?: LangServeHeaders;
    private theInputPreProcessor?: LangServeInputPreProcessor<AiMsg>;
    private theOutputPreProcessor?: LangServeOutputPreProcessor<AiMsg>;
    private theUrl?: string;
    private theUseInputSchema?: boolean;

    constructor(cloneFrom?: LangServeAdapterBuilderImpl<AiMsg>) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theHeaders = cloneFrom.theHeaders;
            this.theInputPreProcessor = cloneFrom.theInputPreProcessor;
            this.theOutputPreProcessor = cloneFrom.theOutputPreProcessor;
            this.theUrl = cloneFrom.theUrl;
        }
    }

    create(): LangServeAbstractAdapter<AiMsg> {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create LangServe adapter. URL is missing. ' +
                    'Make sure you are calling withUrl() before calling create().',
            });
        }

        const options: ChatAdapterOptions<AiMsg> = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
            headers: this.theHeaders,
            inputPreProcessor: this.theInputPreProcessor,
            outputPreProcessor: this.theOutputPreProcessor,
            useInputSchema: this.theUseInputSchema,
        };

        const dataTransferModeToUse = getDataTransferModeToUse(options);
        if (dataTransferModeToUse === 'stream') {
            return new LangServeStreamAdapter<AiMsg>(options);
        }

        return new LangServeBatchAdapter(options);
    }

    withDataTransferMode(mode: DataTransferMode): LangServeAdapterBuilderImpl<AiMsg> {
        if (this.theDataTransferMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        return this;
    }

    withHeaders(headers: LangServeHeaders): ChatAdapterBuilder<AiMsg> {
        if (this.theHeaders !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the headers option more than once',
            });
        }

        this.theHeaders = headers;
        return this;
    }

    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg> {
        if (this.theInputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input pre-processor option more than once',
            });
        }

        this.theInputPreProcessor = inputPreProcessor;
        return this;
    }

    withInputSchema(useInputSchema: boolean): ChatAdapterBuilder<AiMsg> {
        if (this.theUseInputSchema !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input schema option more than once',
            });
        }

        this.theUseInputSchema = useInputSchema;
        return this;
    }

    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg> {
        if (this.theOutputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the output pre-processor option more than once',
            });
        }

        this.theOutputPreProcessor = outputPreProcessor;
        return this;
    }

    withUrl(runnableUrl: string): ChatAdapterBuilder<AiMsg> {
        if (this.theUrl !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the runnable URL option more than once',
            });
        }

        this.theUrl = runnableUrl;
        return this;
    }
}
