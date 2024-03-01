import {ContextAdapter, ContextAdapterBuilder as CoreContextAdapterBuilder} from '@nlux/core';

export interface ContextAdapterBuilder extends CoreContextAdapterBuilder {
    create(): ContextAdapter;
    withUrl(endpointUrl: string): ContextAdapterBuilder;
}
