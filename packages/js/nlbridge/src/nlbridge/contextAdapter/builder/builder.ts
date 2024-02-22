import {AiContextAdapter, ContextAdapterBuilder} from '@nlux/core';

export interface NlBridgeContextAdapterBuilder extends ContextAdapterBuilder {
    create(): AiContextAdapter;
    withUrl(endpointUrl: string): NlBridgeContextAdapterBuilder;
}
