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
} from './types/adapters/chat/chatAdapterExtras';

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

// CONVERSATION _____________

export type {
    ConversationItem,
} from './types/conversation';

export type {
    ConversationPart,
    ConversationPartHandler,
    ConversationPartStatus,
    ConversationPartAiMessage,
    ConversationPartUserMessage,
    ConversationPartItem,
    ConversationPartItemType,
    ConversationPartEvent,
    ConversationPartUpdateCallback,
    ConversationPartChunkCallback,
    ConversationPartCompleteCallback,
    ConversationPartErrorCallback,
} from './types/conversationPart';

export type {
    ParticipantRole,
} from './types/participant';

// DOM COMPONENTS ___________

export type {
    ChatPictureProps,
} from './comp/ChatPicture/props';

export {
    className as compChatPictureClassName,
} from './comp/ChatPicture/create';

export {
    className as compConversationItemClassName,
} from './comp/ConversationItem/create';

export type {
    ExceptionsBoxProps,
} from './comp/ExceptionsBox/props';

export {
    className as compExceptionsBoxClassName,
} from './comp/ExceptionsBox/create';

export {
    className as compLoaderClassName,
} from './comp/Loader/create';

export type {
    MessageStatus,
    MessageDirection,
    MessageProps,
} from './comp/Message/props';

export {
    className as compMessageClassName,
} from './comp/Message/create';

export type {
    PromptBoxStatus,
    PromptBoxProps,
} from './comp/PromptBox/props';

export {
    className as compPromptBoxClassName,
} from './comp/PromptBox/create';

export {
    className as compSendIconClassName,
} from './comp/SendIcon/create';

export type {
    WelcomeMessageProps,
} from './comp/WelcomeMessage/props';

export {
    className as compWelcomeMessageClassName,
    personaNameClassName as compWelcomeMessagePersonaNameClassName,
} from './comp/WelcomeMessage/create';

export {
    welcomeMessageTextClassName as compWelcomeMessageTextClassName,
} from './comp/WelcomeMessage/utils/updateWelcomeMessageText';

// SERVICES _________________

export type {
    SubmitPrompt,
} from './core/aiChat/services/submitPrompt/submitPrompt';

export {
    submitPrompt,
} from './core/aiChat/services/submitPrompt/impl';
