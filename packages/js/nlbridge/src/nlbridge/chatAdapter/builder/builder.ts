import {
    AiContext as CoreAiContext,
    ChatAdapterBuilder as CoreChatAdapterBuilder,
    DataTransferMode,
    StandardChatAdapter,
} from '@nlux/core';

export interface ChatAdapterBuilder extends CoreChatAdapterBuilder {
    create(): StandardChatAdapter;
    withContext(context: CoreAiContext): ChatAdapterBuilder;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder;
    withUrl(endpointUrl: string): ChatAdapterBuilder;
}
