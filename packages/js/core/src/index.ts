// CHAT _____________________

import {AiChat} from './core/aiChat/aiChat';

export {AiChat} from './core/aiChat/aiChat';

export const createAiChat = (): AiChat => new AiChat();

export {Observable} from './core/bus/observable';
export {NluxError, NluxUsageError, NluxValidationError, NluxRenderingError, NluxConfigError} from './core/error';
export {createMdStreamRenderer} from './core/aiChat/markdown/streamParser';
export {debug} from './x/debug';
export {warn, warnOnce} from './x/warn';
export {uid} from './x/uid';

export type {ExceptionId} from './exceptions/exceptions';
export type {ConversationOptions} from './core/aiChat/options/conversationOptions';
export type {PromptBoxOptions} from './core/aiChat/options/promptBoxOptions';
export type {LayoutOptions} from './core/aiChat/options/layoutOptions';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './core/aiChat/options/personaOptions';

export type {
    IObserver,
} from './core/bus/observer';

export type {
    AiChatInternalProps,
} from './types/aiChat/props';

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
} from './types/event';

export type {
    StandardChatAdapter,
} from './types/adapters/chat/standardChatAdapter';

export type {
    StandardAdapterInfo,
    AdapterEncodeFunction,
    AdapterDecodeFunction,
    InputFormat,
    OutputFormat,
} from './types/adapters/chat/standardAdapterConfig';

export type {
    AiChatProps,
} from './types/aiChat/props';

export type {
    ChatAdapter,
    StreamingAdapterObserver,
    DataTransferMode,
} from './types/adapters/chat/chatAdapter';

export type {
    ChatAdapterExtras,
} from './types/adapters/chat/chaAdapterExtras';

export type {
    ChatAdapterBuilder,
} from './types/adapters/chat/chatAdapterBuilder';

export type {
    AssistResult,
    AssistAdapter,
} from './types/adapters/assist/assistAdapter';

export type {
    AssistAdapterBuilder,
} from './types/adapters/assist/assistAdapterBuilder';

export type {
    StreamParser,
    StandardStreamParser,
    StandardStreamParserOutput,
} from './types/markdown/streamParser';

// CONTEXT __________________

export type {
    ContextItemDataType,
    ContextObject,
    ContextItems,
    ContextTasks,
    ContextItem,
    ContextTask,
} from './types/aiContext/data';

export type {
    ContextAdapter,
} from './types/adapters/context/contextAdapter';

export type {
    ContextAdapterExtras,
} from './types/adapters/context/contextAdapterExtras';

export type {
    ContextTasksAdapter,
} from './types/adapters/context/contextTasksAdapter';

export type {
    ContextDataAdapter,
} from './types/adapters/context/contextDataAdapter';

export type {
    ContextAdapterBuilder,
} from './types/adapters/context/contextAdapterBuilder';

export type {
    AiContext,
    AiContextStatus,
} from './types/aiContext/aiContext';

export type {
    ContextItemHandler,
    ContextTaskHandler,
    ContextDomElementHandler,
} from './types/aiContext/contextObservers';

export type {
    InitializeContextResult,
    DestroyContextResult,
    FlushContextResult,
    RunTaskResult,
    ContextActionResult,
    SetContextResult,
} from './types/aiContext/contextResults';

export type {
    DataSyncOptions,
} from './core/aiContext/options/dataSyncOptions';

export {
    createAiContext,
} from './core/aiContext/aiContext';

export {
    predefinedContextSize,
} from './core/aiContext/options/dataSyncOptions';


// HIGHLIGHTER ______________

export type {
    Highlighter,
    HighlighterExtension,
    HighlighterColorMode,
    CreateHighlighterOptions,
} from './core/aiChat/highlighter/highlighter';

// OTHER ____________________

export type {
    ConversationItem,
} from './types/conversation';

export type {
    ParticipantRole,
} from './types/participant';
