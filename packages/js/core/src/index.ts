// CHAT _____________________

import {AiChat} from './exports/aiChat/aiChat';

export {AiChat} from './exports/aiChat/aiChat';

export const createAiChat = <AiMsg = string>(): AiChat<AiMsg> => new AiChat<AiMsg>();

export {Observable} from './exports/bus/observable';
export {createMdStreamRenderer} from './exports/aiChat/markdown/streamParser';

export type {ConversationOptions} from './exports/aiChat/options/conversationOptions';
export type {PromptBoxOptions} from './exports/aiChat/options/promptBoxOptions';
export type {LayoutOptions} from './exports/aiChat/options/layoutOptions';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './exports/aiChat/options/personaOptions';

export type {
    IObserver,
} from './exports/bus/observer';

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
} from './types/aiChat/props';

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
} from './types/markdown/streamParser';

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

// CONVERSATION _____________

export type {
    ChatItem,
} from '../../../shared/src/types/conversation';

export type {
    ParticipantRole,
} from './types/participant';

// SERVICES _________________

export type {
    SubmitPrompt,
} from './exports/aiChat/services/submitPrompt/submitPrompt';

export {
    submitPrompt,
} from './exports/aiChat/services/submitPrompt/submitPromptImpl';
