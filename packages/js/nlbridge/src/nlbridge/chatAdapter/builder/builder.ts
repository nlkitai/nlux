import {
    AiContext as CoreAiContext,
    ChatAdapterBuilder as CoreChatAdapterBuilder,
    StandardChatAdapter,
} from '@nlux/core';
import {ChatAdapterUsageMode} from '../../types/chatAdapterOptions';

export interface ChatAdapterBuilder<MessageType> extends CoreChatAdapterBuilder<MessageType> {
    create(): StandardChatAdapter<MessageType>;
    withContext(context: CoreAiContext): ChatAdapterBuilder<MessageType>;
    withMode(mode: ChatAdapterUsageMode): ChatAdapterBuilder<MessageType>;
    withUrl(endpointUrl: string): ChatAdapterBuilder<MessageType>;
}
