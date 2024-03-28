import {DataTransferMode, NluxUsageError} from '@nlux/core';
import {LangServeAbstractAdapter} from '../adapter/adapter';
import {LangServeFetchAdapter} from '../adapter/fetch';
import {LangServeStreamAdapter} from '../adapter/stream';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeHeaders} from '../types/langServe';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';
import {getDataTransferModeToUse} from '../utils/getDataTransferModeToUse';
import {ChatAdapterBuilder} from './builder';

export class LangServeAdapterBuilderImpl implements ChatAdapterBuilder {
    private theDataTransferMode?: DataTransferMode;
    private theHeaders?: LangServeHeaders;
    private theInputPreProcessor?: LangServeInputPreProcessor;
    private theOutputPreProcessor?: LangServeOutputPreProcessor;
    private theUrl?: string;
    private theUseInputSchema?: boolean;

    constructor(cloneFrom?: LangServeAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theHeaders = cloneFrom.theHeaders;
            this.theInputPreProcessor = cloneFrom.theInputPreProcessor;
            this.theOutputPreProcessor = cloneFrom.theOutputPreProcessor;
            this.theUrl = cloneFrom.theUrl;
        }
    }

    create(): LangServeAbstractAdapter {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create LangServe adapter. URL is missing. ' +
                    'Make sure you are calling withUrl() before calling create().',
            });
        }

        const options: ChatAdapterOptions = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
            headers: this.theHeaders,
            inputPreProcessor: this.theInputPreProcessor,
            outputPreProcessor: this.theOutputPreProcessor,
            useInputSchema: this.theUseInputSchema,
        };

        const dataTransferModeToUse = getDataTransferModeToUse(options);
        if (dataTransferModeToUse === 'stream') {
            return new LangServeStreamAdapter(options);
        }

        return new LangServeFetchAdapter(options);
    }

    withDataTransferMode(mode: DataTransferMode): LangServeAdapterBuilderImpl {
        if (this.theDataTransferMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        return this;
    }
    
    withHeaders(headers: LangServeHeaders): ChatAdapterBuilder {
        if (this.theHeaders !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the headers option more than once',
            });
        }

        this.theHeaders = headers;
        return this;
    }

    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor): ChatAdapterBuilder {
        if (this.theInputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input pre-processor option more than once',
            });
        }

        this.theInputPreProcessor = inputPreProcessor;
        return this;
    }

    withInputSchema(useInputSchema: boolean): ChatAdapterBuilder {
        if (this.theUseInputSchema !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input schema option more than once',
            });
        }

        this.theUseInputSchema = useInputSchema;
        return this;
    }

    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor): ChatAdapterBuilder {
        if (this.theOutputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the output pre-processor option more than once',
            });
        }

        this.theOutputPreProcessor = outputPreProcessor;
        return this;
    }

    withUrl(runnableUrl: string): ChatAdapterBuilder {
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
