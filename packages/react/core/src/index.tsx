import useDeepCompareEffectHook from './hooks/useDeepCompareEffect';

// Exporting from — @nlux/core

export type {
    LayoutOptions,
    PromptBoxOptions,
    ConversationOptions,
    HistoryPayloadSize,
    HighlighterExtension,
    AiChatPropsInEvents,
    UpdatableAiChatProps,
} from '@nlux/core';

export type {
    EventName,
    EventCallback,
    EventsMap,
    ErrorCallback,
    ErrorEventDetails,
    ReadyCallback,
    ReadyEventDetails,
    PreDestroyCallback,
    PreDestroyEventDetails,
    MessageSentCallback,
    MessageStreamStartedCallback,
    MessageReceivedCallback,
    MessageRenderedCallback,
} from '@nlux/core';

// Exporting from — shared

export type {
    ChatItem,
} from '../../../shared/src/types/conversation';

export type {
    ChatAdapter,
    StreamingAdapterObserver,
    DataTransferMode,
} from '../../../shared/src/types/adapters/chat/chatAdapter';

export type {
    ChatAdapterBuilder,
} from '../../../shared/src/types/adapters/chat/chatAdapterBuilder';

export type {
    ChatAdapterExtras,
} from '../../../shared/src/types/adapters/chat/chatAdapterExtras';

export type {
    StandardChatAdapter,
} from '../../../shared/src/types/adapters/chat/standardChatAdapter';

export type {
    StandardAdapterInfo,
} from '../../../shared/src/types/adapters/chat/standardAdapterConfig';

// Exporting from — @nlux/react

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './exports/personaOptions';

export type {
    AiChatProps,
} from './exports/props';

export type {
    FetchResponseComponentProps,
    StreamResponseComponentProps,
    ResponseComponentProps,
    ResponseComponent,
    PromptComponentProps,
    PromptComponent,
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
