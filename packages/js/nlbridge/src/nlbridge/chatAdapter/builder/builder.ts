import {
    AiTaskRunner,
    ChatAdapterBuilder as CoreChatAdapterBuilder,
    DataTransferMode,
    StandardChatAdapter,
} from '@nlux/core';

export interface ChatAdapterBuilder extends CoreChatAdapterBuilder {
    create(): StandardChatAdapter;
    withContextId(contextId: string): ChatAdapterBuilder;
    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder;
    withTaskRunner(taskRunner: AiTaskRunner): ChatAdapterBuilder;
    withUrl(endpointUrl: string): ChatAdapterBuilder;
}
