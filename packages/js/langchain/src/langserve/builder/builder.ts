import {AdapterBuilder, DataTransferMode, StandardAdapter} from '@nlux/core';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';

export interface LangServeAdapterBuilder extends AdapterBuilder {
    create(): StandardAdapter;
    withDataTransferMode(mode: DataTransferMode): LangServeAdapterBuilder;
    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor): LangServeAdapterBuilder;
    withInputSchema(useInputSchema: boolean): LangServeAdapterBuilder;
    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor): LangServeAdapterBuilder;
    withUrl(runnableUrl: string): LangServeAdapterBuilder;
}
