import {AiChat} from './core/aiChat';

export {AiChat} from './core/aiChat';
export const createAiChat = (): AiChat => new AiChat();

export {Observable} from './core/bus/observable';
export {NluxError, NluxUsageError, NluxValidationError, NluxRenderingError, NluxConfigError} from './core/error';
export {createMdStreamRenderer} from './core/markdown/streamParser';
export {debug, warn} from './x/debug';

export type {ExceptionId} from './exceptions/exceptions';
export type {ConversationOptions} from './core/options/conversationOptions';
export type {PromptBoxOptions} from './core/options/promptBoxOptions';
export type {LayoutOptions} from './core/options/layoutOptions';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './core/options/personaOptions';

export type {IObserver} from './core/bus/observer';
export type {ExposedConfig} from './core/config';

export type {NluxProps} from './types/props';

export type {
    EventName,
    EventCallback,
    ErrorCallback,
    ErrorEventDetails,
    EventsMap,
    MessageSentCallback,
    MessageReceivedCallback,
} from './types/event';

export type {
    StandardAdapter,
    StandardAdapterEvent,
    StandardAdapterStatus,
    StandardAdapterEventData,
} from './types/standardAdapter';

export type {
    StandardAdapterConfig,
    StandardAdapterInfo,
} from './types/standardAdapterConfig';

export type {
    DataTransferMode,
    Adapter,
    StreamingAdapterObserver,
} from './types/adapter';

export type {
    StreamParser,
    StandardStreamParser,
    StandardStreamParserOutput,
} from './types/markdown/streamParser';

export type {
    Highlighter,
    HighlighterExtension,
    HighlighterColorMode,
    CreateHighlighterOptions,
} from './core/highlighter/highlighter';

export type {AdapterBuilder} from './types/adapterBuilder';

export type {Participant} from './types/participant';
export type {FragmentType, Fragment} from './types/fragment';
export type {NluxContext} from './types/context';
