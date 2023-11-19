import {ExceptionId} from '../exceptions/exceptions';
import {NluxAdapter} from './adapter';
import {Adapter} from './adapterInterface';

export type NluxContext = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: Adapter | NluxAdapter<any, any>;
}>;
