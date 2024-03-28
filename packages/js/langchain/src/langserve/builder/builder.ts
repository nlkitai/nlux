import {ChatAdapterBuilder as CoreChatAdapterBuilder, DataTransferMode, StandardChatAdapter} from '@nlux/core';
import {LangServeHeaders} from '../types/langServe';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';

export interface ChatAdapterBuilder extends CoreChatAdapterBuilder {
    create(): StandardChatAdapter;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder;
    withHeaders(headers: LangServeHeaders): ChatAdapterBuilder;
    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor): ChatAdapterBuilder;
    withInputSchema(useInputSchema: boolean): ChatAdapterBuilder;
    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor): ChatAdapterBuilder;
    withUrl(runnableUrl: string): ChatAdapterBuilder;
}
