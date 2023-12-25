import {HighlighterExtension} from '../core/highlighter/highlighter';
import {ExceptionId} from '../exceptions/exceptions';
import {Adapter} from './adapter';
import {StandardAdapter} from './standardAdapter';

export type ContextProps = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: Adapter | StandardAdapter<any, any>;
    syntaxHighlighter?: HighlighterExtension;
}>;

export type NluxContext = ContextProps & {
    update: (props: Partial<ContextProps>) => void;
};

export const createContext = (props: ContextProps): NluxContext => {
    const context: NluxContext = {
        ...props,
        update: (newProps: Partial<ContextProps>) => {
            Object.assign(context, newProps);
        },
    };

    return context;
};
