import {ContextAdapter} from '@nlux/core';
import {NLBridgeContextAdapter} from '../contextAdapter';
import {ContextAdapterBuilder} from './builder';

export class ContextAdapterBuilderImpl implements ContextAdapterBuilder {
    private endpointUrl: string | undefined = undefined;

    build(): ContextAdapter {
        if (!this.endpointUrl) {
            throw new Error('Endpoint URL is required');
        }

        return new NLBridgeContextAdapter(this.endpointUrl);
    }

    withUrl(endpointUrl: string): ContextAdapterBuilderImpl {
        if (this.endpointUrl !== undefined && this.endpointUrl !== endpointUrl) {
            throw new Error('Cannot set the endpoint URL more than once');
        }

        this.endpointUrl = endpointUrl;
        return this;
    }
}