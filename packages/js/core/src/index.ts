// CHAT _____________________

import {AiChat} from './exports/aiChat/aiChat';

export {AiChat} from './exports/aiChat/aiChat';

export const createAiChat = <AiMsg = string>(): AiChat<AiMsg> => new AiChat<AiMsg>();

export {Observable} from './exports/bus/observable';

export type {
    ConversationOptions,
    ConversationLayout,
} from './exports/aiChat/options/conversationOptions';

export type {ComposerOptions} from './exports/aiChat/options/composerOptions';
export type {
    BatchResponseComponentProps,
    StreamResponseComponentProps,
    ResponseRenderer,
    PromptRendererProps,
    PromptRenderer,
    MessageOptions
} from './exports/aiChat/options/messageOptions';
export type {DisplayOptions} from './exports/aiChat/options/displayOptions';

export type {
    PersonaOptions,
    AssistantPersona,
    UserPersona,
} from './exports/aiChat/options/personaOptions';

export type {
    IObserver,
} from './exports/bus/observer';

export type {
    AiChatInternalProps,
} from './types/aiChat/props';

export type {
    AiChatStatus
} from './types/aiChat/aiChat';

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
} from './types/event';

export type {
    StandardChatAdapter,
} from '../../../shared/src/types/adapters/chat/standardChatAdapter';

export type {
    StandardAdapterInfo,
    AdapterEncodeFunction,
    AdapterDecodeFunction,
    InputFormat,
    OutputFormat,
} from '../../../shared/src/types/adapters/chat/standardAdapterConfig';

export type {
    AiChatProps,
    UpdatableAiChatProps,
    AiChatPropsInEvents,
} from './types/aiChat/props';

export type {
    HistoryPayloadSize,
} from './exports/aiChat/options/conversationOptions';

export type {
    ChatAdapter,
    StreamingAdapterObserver,
    DataTransferMode,
} from '../../../shared/src/types/adapters/chat/chatAdapter';

export type {
    ChatAdapterExtras,
} from '../../../shared/src/types/adapters/chat/chatAdapterExtras';

export type {
    ChatAdapterBuilder,
} from '../../../shared/src/types/adapters/chat/chatAdapterBuilder';

export type {
    AssistResult,
    AssistAdapter,
} from '../../../shared/src/types/adapters/assist/assistAdapter';

export type {
    AssistAdapterBuilder,
} from '../../../shared/src/types/adapters/assist/assistAdapterBuilder';

export type {
    StreamParser,
    StandardStreamParser,
    StandardStreamParserOutput,
} from '../../../shared/src/types/markdown/streamParser';

// CONTEXT __________________

export type {
    ContextItemDataType,
    ContextObject,
    ContextItems,
    ContextTasks,
    ContextItem,
    ContextTask,
} from '../../../shared/src/types/aiContext/data';

export type {
    ContextAdapter,
} from '../../../shared/src/types/adapters/context/contextAdapter';

export type {
    ContextAdapterExtras,
} from '../../../shared/src/types/adapters/context/contextAdapterExtras';

export type {
    ContextTasksAdapter,
} from '../../../shared/src/types/adapters/context/contextTasksAdapter';

export type {
    ContextDataAdapter,
} from '../../../shared/src/types/adapters/context/contextDataAdapter';

export type {
    ContextAdapterBuilder,
} from '../../../shared/src/types/adapters/context/contextAdapterBuilder';

export type {
    AiContext,
    AiContextStatus,
} from '../../../shared/src/types/aiContext/aiContext';

export type {
    ContextItemHandler,
    ContextTaskHandler,
    ContextDomElementHandler,
} from '../../../shared/src/types/aiContext/contextObservers';

export type {
    InitializeContextResult,
    DestroyContextResult,
    FlushContextResult,
    RunTaskResult,
    ContextActionResult,
    SetContextResult,
} from '../../../shared/src/types/aiContext/contextResults';

export type {
    DataSyncOptions,
} from './exports/aiContext/options/dataSyncOptions';

export {
    createAiContext,
} from './exports/aiContext/aiContext';

export {
    predefinedContextSize,
} from './exports/aiContext/options/dataSyncOptions';


// HIGHLIGHTER ______________

export type {
    Highlighter,
    HighlighterExtension,
    HighlighterColorMode,
    CreateHighlighterOptions,
} from './exports/aiChat/highlighter/highlighter';

// HTML SANITIZER ___________

export type {
    SanitizerExtension
} from './exports/aiChat/sanitizer/sanitizer';

// CONVERSATION _____________

export type {
    ChatItem,
} from '../../../shared/src/types/conversation';

export type {
    ParticipantRole,
} from './types/participant';
