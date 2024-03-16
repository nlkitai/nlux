import {ContextAdapter, ContextAdapterBuilder as CoreContextAdapterBuilder} from '@nlux/core';

export interface ContextAdapterBuilder extends CoreContextAdapterBuilder {
    build(): ContextAdapter;
    withUrl(endpointUrl: string): ContextAdapterBuilder;
}
