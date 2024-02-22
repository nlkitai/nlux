import {AdapterBuilder, DataTransferMode, StandardAdapter} from '@nlux/core';
import {AiTaskRunner} from '../../types/aiTaskRunner';

export interface ChatAdapterBuilder extends AdapterBuilder {
    create(): StandardAdapter;
    withContextId(contextId: string): ChatAdapterBuilder;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder;
    withTaskRunner(taskRunner: AiTaskRunner): ChatAdapterBuilder;
    withUrl(endpointUrl: string): ChatAdapterBuilder;
}
