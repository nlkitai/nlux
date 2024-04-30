import {
    AiContext as CoreAiContext,
    ChatAdapterBuilder as CoreChatAdapterBuilder,
    StandardChatAdapter,
} from '@nlux/core';
import {ChatAdapterUsageMode} from '../../types/chatAdapterOptions';

export interface ChatAdapterBuilder<AiMsg> extends CoreChatAdapterBuilder<AiMsg> {
    create(): StandardChatAdapter<AiMsg>;
    withContext(context: CoreAiContext): ChatAdapterBuilder<AiMsg>;
    withMode(mode: ChatAdapterUsageMode): ChatAdapterBuilder<AiMsg>;
    withUrl(endpointUrl: string): ChatAdapterBuilder<AiMsg>;
    withHeaders(headers: Record<string, string>): ChatAdapterBuilder<AiMsg>;
}
