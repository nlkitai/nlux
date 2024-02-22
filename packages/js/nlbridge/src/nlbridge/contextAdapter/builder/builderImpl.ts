import {AiContextAdapter} from '@nlux/core';
import {ContextAdapter} from '../contextAdapter';
import {NlBridgeContextAdapterBuilder} from './builder';

export class NlBridgeContextAdapterBuilderImpl implements NlBridgeContextAdapterBuilder {
    private endpointUrl: string | undefined = undefined;

    create(): AiContextAdapter {
        if (!this.endpointUrl) {
            throw new Error('Endpoint URL is required');
        }

        return new ContextAdapter(this.endpointUrl);
    }

    withUrl(endpointUrl: string): NlBridgeContextAdapterBuilderImpl {
        if (this.endpointUrl !== undefined && this.endpointUrl !== endpointUrl) {
            throw new Error('Cannot set the endpoint URL more than once');
        }

        this.endpointUrl = endpointUrl;
        return this;
    }
}