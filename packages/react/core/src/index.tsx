import useDeepCompareEffectHook from './hooks/useDeepCompareEffect';

// Exporting from — @nlux/core

export type {
    DisplayOptions,
    ComposerOptions,
    ConversationLayout,
    HistoryPayloadSize,
    HighlighterExtension,
    AiChatPropsInEvents,
    UpdatableAiChatProps,
} from '@nlux/core';

export type {
    EventName,
    EventCallback,
    EventsConfig,
    ErrorCallback,
    ErrorEventDetails,
    ReadyCallback,
    ReadyEventDetails,
    PreDestroyCallback,
    PreDestroyEventDetails,
    MessageSentCallback,
    MessageSentEventDetails,
    MessageStreamStartedCallback,
    MessageStreamStartedEventDetails,
    MessageReceivedCallback,
    MessageReceivedEventDetails,
    MessageRenderedCallback,
    MessageRenderedEventDetails,
    IObserver,
} from '@nlux/core';

// Exporting from — shared

export type {
    ChatItem,
} from '@shared/types/conversation';

export type {
    SanitizerExtension,
} from '@shared/sanitizer/sanitizer';

export type {
    StreamingAdapterObserver,
    DataTransferMode,
    StreamSend,
    BatchSend,
} from '@shared/types/adapters/chat/chatAdapter';

export type {
    ChatAdapterBuilder,
} from '@shared/types/adapters/chat/chatAdapterBuilder';

export type {
    ChatAdapterExtras,
} from '@shared/types/adapters/chat/chatAdapterExtras';

export type {
    StandardChatAdapter,
} from '@shared/types/adapters/chat/standardChatAdapter';

export type {
    StandardAdapterInfo,
} from '@shared/types/adapters/chat/standardAdapterConfig';

export type {
    StreamedServerComponent,
} from '@shared/types/adapters/chat/serverComponentChatAdapter';

// Exporting from — @nlux/react

export type {
    PersonaOptions,
    AssistantPersona,
    UserPersona,
} from './exports/personaOptions';

export type {
    AiChatProps,
} from './exports/props';

export type {
    ChatAdapter,
} from './types/chatAdapter';

export type {
    ConversationOptions,
} from './types/conversationOptions';

export type {
    AiChatApi,
} from './exports/hooks/useAiChatApi';

export type {
    MessageOptions,
    ResponseRenderer,
    ResponseRendererProps,
    PromptRenderer,
    PromptRendererProps,
} from './exports/messageOptions';

export type {
    ConversationStarter,
} from './types/conversationStarter';

export {
    AiChat,
} from './exports/AiChat';

export {
    useAiChatApi,
} from './exports/hooks/useAiChatApi';

export {
    Markdown,
} from './exports/primitives/Markdown';

export type {
    AiChatUIOverrides,
} from './exports/AiChatUI';

export {
    AiChatUI,
} from './exports/AiChatUI';

export {
    useAsBatchAdapter,
} from './exports/hooks/useAsBatchAdapter';

export {
    useAsStreamAdapter,
} from './exports/hooks/useAsStreamAdapter';

export {
    useAsRscAdapter,
} from './exports/hooks/useAsRscAdapter';

export type {
    UpdateContextItem,
    DiscardContextItem,
} from './providers/useAiContext';

export {
    useAiContext,
} from './providers/useAiContext';

export {
    useAiTask,
} from './providers/useAiTask';

export type {
    AiContext,
    AiContextProviderProps,
} from './types/AiContext';

export {
    createAiContext,
} from './providers/createAiContext';

export const useDeepCompareEffect = useDeepCompareEffectHook;
