import {AiContext as CoreAiContext, DataTransferMode, NluxUsageError, StandardChatAdapter} from '@nlux/core';
import {ChatAdapterOptions} from '../../types/chatAdapterOptions';
import {NLBridgeAbstractAdapter} from '../adapter';
import {NLBridgeFetchAdapter} from '../fetch';
import {NLBridgeStreamAdapter} from '../stream';
import {ChatAdapterBuilder} from './builder';

export class ChatAdapterBuilderImpl implements ChatAdapterBuilder {
    private theContext?: CoreAiContext | undefined;
    private theDataTransferMode?: DataTransferMode;
    private theUrl?: string;

    constructor(cloneFrom?: ChatAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theUrl = cloneFrom.theUrl;
            this.theContext = cloneFrom.theContext;
            this.theContext = cloneFrom.theContext;
        }
    }

    create(): StandardChatAdapter {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create NLBridge adapter. URL is missing. Make sure you are call withUrl() '
                    + 'or provide url option before calling creating the adapter.',
            });
        }

        const options: ChatAdapterOptions = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
            context: this.theContext,
        };

        const dataTransferModeToUse = options.dataTransferMode
            ?? NLBridgeAbstractAdapter.defaultDataTransferMode;

        if (dataTransferModeToUse === 'stream') {
            return new NLBridgeStreamAdapter(options);
        }

        return new NLBridgeFetchAdapter(options);
    }

    withContext(context: CoreAiContext): ChatAdapterBuilderImpl {
        if (this.theContext !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the context ID option more than once',
            });
        }

        this.theContext = context;
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
