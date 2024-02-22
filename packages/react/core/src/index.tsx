/** COMPONENTS ***************************************************************/
export type {
    Adapter,
    AdapterBuilder,
    AdapterExtras,
    StreamingAdapterObserver,
    StandardAdapter,
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
    AiChatReactProps,
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
    ClearContextItem,
} from './providers/useAiContext';

/** CONTEXT *******************************************************************/

export {
    useAiContext,
} from './providers/useAiContext';

export type {
    AiContext,
    AiContextProviderProps,
    AiContextData,
} from './types/AiContext';

export {
    createAiContext,
} from './providers/createAiContext';
