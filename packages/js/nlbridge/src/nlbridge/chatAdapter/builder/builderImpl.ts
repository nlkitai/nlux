import {AiTaskRunner, DataTransferMode, NluxUsageError, StandardChatAdapter} from '@nlux/core';
import {ChatAdapterOptions} from '../../types/chatAdapterOptions';
import {NLBridgeAbstractAdapter} from '../adapter';
import {NLBridgeFetchAdapter} from '../fetch';
import {NLBridgeStreamAdapter} from '../stream';
import {ChatAdapterBuilder} from './builder';

export class ChatAdapterBuilderImpl implements ChatAdapterBuilder {
    private theContextId?: string;
    private theDataTransferMode?: DataTransferMode;
    private theTaskRunner: AiTaskRunner | undefined;
    private theUrl?: string;

    constructor(cloneFrom?: ChatAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theUrl = cloneFrom.theUrl;
            this.theContextId = cloneFrom.theContextId;
            this.theTaskRunner = cloneFrom.theTaskRunner;
        }
    }

    create(): StandardChatAdapter {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create NLBridge adapter. URL is missing. ' +
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
            ?? NLBridgeAbstractAdapter.defaultDataTransferMode;

        if (dataTransferModeToUse === 'stream') {
            return new NLBridgeStreamAdapter(options);
        }

        return new NLBridgeFetchAdapter(options);
    }

    withContextId(contextId: string): ChatAdapterBuilderImpl {
        if (this.theContextId !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the context ID option more than once',
            });
        }

        this.theContextId = contextId;
        return this;
    }

    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilderImpl {
        if (this.theDataTransferMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        return this;
    }

    withTaskRunner(callback: AiTaskRunner): ChatAdapterBuilderImpl {
        if (this.theTaskRunner !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the task runner option more than once',
            });
        }

        this.theTaskRunner = callback;
        return this;
    }

    withUrl(endpointUrl: string): ChatAdapterBuilderImpl {
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
