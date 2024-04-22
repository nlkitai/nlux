import {AiContext as CoreAiContext, StandardChatAdapter} from '@nlux/core';
import {NluxUsageError} from '../../../../../../shared/src/types/error';
import {ChatAdapterOptions, ChatAdapterUsageMode} from '../../types/chatAdapterOptions';
import {NLBridgeAbstractAdapter} from '../adapter';
import {NLBridgeFetchAdapter} from '../fetch';
import {NLBridgeStreamAdapter} from '../stream';
import {ChatAdapterBuilder} from './builder';

export class ChatAdapterBuilderImpl<MessageType> implements ChatAdapterBuilder<MessageType> {
    private theContext?: CoreAiContext | undefined;
    private theMode?: ChatAdapterUsageMode;
    private theUrl?: string;

    constructor(cloneFrom?: ChatAdapterBuilderImpl<MessageType>) {
        if (cloneFrom) {
            this.theUrl = cloneFrom.theUrl;
            this.theMode = cloneFrom.theMode;
            this.theContext = cloneFrom.theContext;
        }
    }

    create(): StandardChatAdapter<MessageType> {
        if (!this.theUrl) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create NLBridge adapter. URL is missing. Make sure you are call withUrl() '
                    + 'or provide url option before calling creating the adapter.',
            });
        }

        const options: ChatAdapterOptions = {
            url: this.theUrl,
            mode: this.theMode,
            context: this.theContext,
        };

        const dataTransferModeToUse = options.mode
            ?? NLBridgeAbstractAdapter.defaultDataTransferMode;

        if (dataTransferModeToUse === 'stream') {
            return new NLBridgeStreamAdapter<MessageType>(options);
        }

        return new NLBridgeFetchAdapter<MessageType>(options);
    }

    withContext(context: CoreAiContext): ChatAdapterBuilderImpl<MessageType> {
        if (this.theContext !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the context ID option more than once',
            });
        }

        this.theContext = context;
        return this;
    }

    withMode(mode: ChatAdapterUsageMode): ChatAdapterBuilderImpl<MessageType> {
        if (this.theMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the usage mode option more than once',
            });
        }

        this.theMode = mode;
        return this;
    }

    withUrl(endpointUrl: string): ChatAdapterBuilderImpl<MessageType> {
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
