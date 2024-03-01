import {AdapterBuilder, AiTaskRunner, DataTransferMode, StandardAdapter} from '@nlux/core';

export interface ChatAdapterBuilder extends AdapterBuilder {
    create(): StandardAdapter;
    withContextId(contextId: string): ChatAdapterBuilder;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder;
    withTaskRunner(taskRunner: AiTaskRunner): ChatAdapterBuilder;
    withUrl(endpointUrl: string): ChatAdapterBuilder;
}
