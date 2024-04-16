import {ChatAdapterBuilder as CoreChatAdapterBuilder, DataTransferMode, StandardChatAdapter} from '@nlux/core';
import {LangServeInputPreProcessor} from '../types/inputPreProcessor';
import {LangServeHeaders} from '../types/langServe';
import {LangServeOutputPreProcessor} from '../types/outputPreProcessor';

export interface ChatAdapterBuilder<MessageType> extends CoreChatAdapterBuilder<MessageType> {
    create(): StandardChatAdapter<MessageType>;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder<MessageType>;
    withHeaders(headers: LangServeHeaders): ChatAdapterBuilder<MessageType>;
    withInputPreProcessor(inputPreProcessor: LangServeInputPreProcessor): ChatAdapterBuilder<MessageType>;
    withInputSchema(useInputSchema: boolean): ChatAdapterBuilder<MessageType>;
    withOutputPreProcessor(outputPreProcessor: LangServeOutputPreProcessor<MessageType>): ChatAdapterBuilder<MessageType>;
    withUrl(runnableUrl: string): ChatAdapterBuilder<MessageType>;
}
