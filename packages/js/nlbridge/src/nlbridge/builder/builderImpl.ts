import {DataTransferMode, NluxUsageError, StandardAdapter} from '@nlux/core';
import {NlBridgeAbstractAdapter} from '../adapter/adapter';
import {NlBridgeFetchAdapter} from '../adapter/fetch';
import {NlBridgeStreamAdapter} from '../adapter/stream';
import {NlBridgeAdapterOptions} from '../types/adapterOptions';
import {NlBridgeAdapterBuilder} from './builder';

export class NlBridgeAdapterBuilderImpl implements NlBridgeAdapterBuilder {
    private theDataTransferMode?: DataTransferMode;
    private theUrl?: string;

    constructor(cloneFrom?: NlBridgeAdapterBuilderImpl) {
        if (cloneFrom) {
            this.theDataTransferMode = cloneFrom.theDataTransferMode;
            this.theUrl = cloneFrom.theUrl;
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

        const options: NlBridgeAdapterOptions = {
            url: this.theUrl,
            dataTransferMode: this.theDataTransferMode,
        };

        const dataTransferModeToUse = options.dataTransferMode
            ?? NlBridgeAbstractAdapter.defaultDataTransferMode;

        if (dataTransferModeToUse === 'stream') {
            return new NlBridgeStreamAdapter(options);
        }

        return new NlBridgeFetchAdapter(options);
    }

    withDataTransferMode(mode: DataTransferMode): NlBridgeAdapterBuilder {
        if (this.theDataTransferMode !== undefined) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        return this;
    }

    withUrl(endpointUrl: string): NlBridgeAdapterBuilder {
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
