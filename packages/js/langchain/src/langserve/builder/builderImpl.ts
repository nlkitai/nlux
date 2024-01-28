import {DataTransferMode, NluxUsageError} from '@nlux/core';
import {LangServeAbstractAdapter} from '../adapter/adapter';
import {LangServeFetchAdapter} from '../adapter/fetch';
import {LangServeStreamAdapter} from '../adapter/stream';
import {LangServeAdapterOptions} from '../types/adapterOptions';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';
import {getDataTransferModeToUse} from '../utils/getDataTransferModeToUse';
import {LangServeAdapterBuilder} from './builder';

export class LangServeAdapterBuilderImpl implements LangServeAdapterBuilder {
    private theDataTransferMode?: DataTransferMode;
    private theInputPreProcessor?: LangServeInputPreProcessor;
    private theOutputPreProcessor?: LangServeOutputPreProcessor;
    private theUrl?: string;
    private theUseInputSchema?: boolean;

    constructor(cloneFrom?: LangServeAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
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

        const options: LangServeAdapterOptions = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
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

    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor): LangServeAdapterBuilder {
        if (this.theInputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input pre-processor option more than once',
            });
        }

        this.theInputPreProcessor = inputPreProcessor;
        return this;
    }

    withInputSchema(useInputSchema: boolean): LangServeAdapterBuilder {
        if (this.theUseInputSchema !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input schema option more than once',
            });
        }

        this.theUseInputSchema = useInputSchema;
        return this;
    }

    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor): LangServeAdapterBuilder {
        if (this.theOutputPreProcessor !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the output pre-processor option more than once',
            });
        }

        this.theOutputPreProcessor = outputPreProcessor;
        return this;
    }

    withUrl(runnableUrl: string): LangServeAdapterBuilder {
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
