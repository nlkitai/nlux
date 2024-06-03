import useDeepCompareEffectHook from './hooks/useDeepCompareEffect';

// Exporting from — @nlux/core

export type {
    DisplayOptions,
    ComposerOptions,
    ConversationLayout,
    HistoryPayloadSize,
    HighlighterExtension,
    SanitizerExtension,
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
    ChatAdapter,
    StreamingAdapterObserver,
    DataTransferMode,
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
    ConversationOptions,
} from './types/conversationOptions';

export type {
    BatchResponseComponentProps,
    StreamResponseComponentProps,
    ResponseRenderer,
    PromptRendererProps,
    PromptRenderer,
    MessageOptions,
} from './exports/messageOptions';

export {
    AiChat,
} from './exports/AiChat';

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
