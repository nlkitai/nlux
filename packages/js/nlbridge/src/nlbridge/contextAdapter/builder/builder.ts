import {ContextAdapter, ContextAdapterBuilder as CoreContextAdapterBuilder} from '@nlux/core';

export interface ContextAdapterBuilder extends CoreContextAdapterBuilder {
    build(): ContextAdapter;
    withHeaders(headers: Record<string, string>): ContextAdapterBuilder;
    withUrl(endpointUrl: string): ContextAdapterBuilder;
}
