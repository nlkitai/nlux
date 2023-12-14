import {HighlighterExtension} from '../core/highlighter/highlighter';
import {ExceptionId} from '../exceptions/exceptions';
import {Adapter} from './adapter';
import {StandardAdapter} from './standardAdapter';

export type NluxContext = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: Adapter | StandardAdapter<any, any>;
    syntaxHighlighter?: HighlighterExtension;
}>;
