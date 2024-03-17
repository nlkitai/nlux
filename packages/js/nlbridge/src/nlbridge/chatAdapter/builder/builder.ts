import {
    AiContext as CoreAiContext,
    ChatAdapterBuilder as CoreChatAdapterBuilder,
    StandardChatAdapter,
} from '@nlux/core';
import {ChatAdapterUsageMode} from '../../types/chatAdapterOptions';

export interface ChatAdapterBuilder extends CoreChatAdapterBuilder {
    create(): StandardChatAdapter;
    withContext(context: CoreAiContext): ChatAdapterBuilder;
    withMode(mode: ChatAdapterUsageMode): ChatAdapterBuilder;
    withUrl(endpointUrl: string): ChatAdapterBuilder;
}
