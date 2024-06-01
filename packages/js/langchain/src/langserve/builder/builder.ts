import {ChatAdapterBuilder as CoreChatAdapterBuilder, DataTransferMode, StandardChatAdapter} from '@nlux/core';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeConfig, LangServeHeaders} from '../types/langServe';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';

export interface ChatAdapterBuilder<AiMsg> extends CoreChatAdapterBuilder<AiMsg> {
    create(): StandardChatAdapter<AiMsg>;

    withConfig(langServeConfig: LangServeConfig): ChatAdapterBuilder<AiMsg>;

    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder<AiMsg>;

    withHeaders(headers: LangServeHeaders): ChatAdapterBuilder<AiMsg>;

    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg>;

    withInputSchema(useInputSchema: boolean): ChatAdapterBuilder<AiMsg>;

    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg>;

    withUrl(runnableUrl: string): ChatAdapterBuilder<AiMsg>;
}
