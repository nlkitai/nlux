import useDeepCompareEffectHook from './hooks/useDeepCompareEffect';

export type {
    ChatAdapter,
    ChatAdapterBuilder,
    ChatAdapterExtras,
    StreamingAdapterObserver,
    StandardChatAdapter,
    DataTransferMode,
    LayoutOptions,
    PromptBoxOptions,
    ConversationOptions,
    HighlighterExtension,
    ExceptionId,
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
    MessageReceivedCallback,
} from '@nlux/core';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './components/AiChat/personaOptions';

export type {
    AiChatComponentProps,
} from './components/AiChat/props';

export {
    NluxError,
    NluxUsageError,
    NluxValidationError,
    NluxRenderingError,
    NluxConfigError,
    debug,
} from '@nlux/core';

export {AiChat} from './components/AiChat';

export type {
    UpdateContextItem,
    DiscardContextItem,
} from './providers/useAiContext';

export {
    useAiContext,
} from './providers/useAiContext';

export type {
    AiContext,
    AiContextProviderProps,
} from './types/AiContext';

export {
    createAiContext,
} from './providers/createAiContext';

export const useDeepCompareEffect = useDeepCompareEffectHook;
