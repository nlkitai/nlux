import {DataTransferMode, NluxUsageError, StandardAdapter} from '@nlux/core';
import {AiTaskRunner} from '../../types/aiTaskRunner';
import {ChatAdapterOptions} from '../../types/chatAdapterOptions';
import {NlBridgeAbstractAdapter} from '../adapter';
import {NlBridgeFetchAdapter} from '../fetch';
import {NlBridgeStreamAdapter} from '../stream';
import {ChatAdapterBuilder} from './builder';

export class NlBridgeAdapterBuilderImpl implements ChatAdapterBuilder {
    private theContextId?: string;
    private theDataTransferMode?: DataTransferMode;
    private theTaskRunner: AiTaskRunner | undefined;
    private theUrl?: string;

    constructor(cloneFrom?: NlBridgeAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theUrl = cloneFrom.theUrl;
            this.theContextId = cloneFrom.theContextId;
            this.theTaskRunner = cloneFrom.theTaskRunner;
        }
    }

    create(): StandardAdapter {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create NlBridge adapter. URL is missing. ' +
                    'Make sure you are calling withUrl() before calling create().',
            });
        }

        const options: ChatAdapterOptions = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
            contextId: this.theContextId,
            taskRunner: this.theTaskRunner,
        };

        const dataTransferModeToUse = options.dataTransferMode
            ?? NlBridgeAbstractAdapter.defaultDataTransferMode;

        if (dataTransferModeToUse === 'stream') {
            return new NlBridgeStreamAdapter(options);
        }

        return new NlBridgeFetchAdapter(options);
    }

    withContextId(contextId: string): ChatAdapterBuilder {
        if (this.theContextId !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the context ID option more than once',
            });
        }

        this.theContextId = contextId;
        return this;
    }

    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder {
        if (this.theDataTransferMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        return this;
    }

    withTaskRunner(callback: AiTaskRunner): ChatAdapterBuilder {
        if (this.theTaskRunner !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the task runner option more than once',
            });
        }

        this.theTaskRunner = callback;
        return this;
    }

    withUrl(endpointUrl: string): ChatAdapterBuilder {
        if (this.theUrl !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the endpoint URL option more than once',
            });
        }

        this.theUrl = endpointUrl;
        return this;
    }
}
