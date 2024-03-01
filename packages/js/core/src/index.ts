// CHAT --------

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
    AiTaskRunner,
} from './types/aiAssistant/taskRunner';

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
} from './types/aiChat/standardChatAdapter';

export type {
    StandardAdapterInfo,
    AdapterEncodeFunction,
    AdapterDecodeFunction,
    InputFormat,
    OutputFormat,
} from './types/aiChat/standardAdapterConfig';

export type {
    AiChatProps,
} from './types/aiChat/props';

export type {
    ChatAdapter,
    ChatAdapterExtras,
    StreamingAdapterObserver,
    DataTransferMode,
} from './types/aiChat/chatAdapter';

export type {
    ChatAdapterBuilder,
} from './types/aiChat/chatAdapterBuilder';

export type {
    StreamParser,
    StandardStreamParser,
    StandardStreamParserOutput,
} from './types/markdown/streamParser';

// CONTEXT --------

export type {
    GetContextDataResult,
    GetContextDataCallback,
} from './types/aiContext/get';

export type {
    SetContextResult,
    SetContextCallback,
} from './types/aiContext/set';

export type {
    UpdateContextResult,
    UpdateContextCallback,
} from './types/aiContext/update';

export type {
    ClearContextResult,
    ClearContextCallback,
} from './types/aiContext/clear';

export type {
    ContextData,
} from './types/aiContext/data';

export type {
    ContextAdapter,
} from './types/aiContext/contextAdapter';

export type {
    ContextAdapterBuilder,
} from './types/aiContext/builder';

// ASSISTANT --------

export type {
    AssistResult,
} from './types/aiAssistant/assist';

export type {
    RegisterTaskResult,
    RegisterTaskCallback,
} from './types/aiAssistant/registerTask';

export type {
    UnregisterTaskResult,
    UnregisterTaskCallback,
} from './types/aiAssistant/unregisterTask';

// HIGHLIGHTER --------

export type {
    Highlighter,
    HighlighterExtension,
    HighlighterColorMode,
    CreateHighlighterOptions,
} from './core/aiChat/highlighter/highlighter';

// OTHERS --------

export type {
    ConversationItem,
} from './types/conversation';

export type {
    ParticipantRole,
} from './types/participant';
