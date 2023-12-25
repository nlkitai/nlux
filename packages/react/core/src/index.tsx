export type {
    Adapter,
    AdapterBuilder,
    StreamingAdapterObserver,
    StandardAdapter,
    DataTransferMode,
    LayoutOptions,
    PromptBoxOptions,
    ConversationOptions,
    HighlighterExtension,
} from '@nlux/core';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './components/AiChat/personaOptions';

export type {
    AiChatProps,
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
