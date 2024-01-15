import {HighlighterExtension} from '../core/highlighter/highlighter';
import {ConversationOptions} from '../core/options/conversationOptions';
import {LayoutOptions} from '../core/options/layoutOptions';
import {PersonaOptions} from '../core/options/personaOptions';
import {PromptBoxOptions} from '../core/options/promptBoxOptions';
import {Adapter} from './adapter';
import {EventsMap} from './event';
import {StandardAdapter} from './standardAdapter';

export type NluxProps = {
    adapter: Adapter | StandardAdapter<any, any>;
    events?: Partial<EventsMap>;
    themeId?: string;
    className?: string;
    promptBoxOptions: Partial<PromptBoxOptions>;
    conversationOptions: Partial<ConversationOptions>;
    personaOptions: Partial<PersonaOptions>;
    layoutOptions: Partial<LayoutOptions>;
    syntaxHighlighter?: HighlighterExtension;
};
