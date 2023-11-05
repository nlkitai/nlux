import {Adapter} from './adapter';

export type NluxContext = Readonly<{
    instanceId: string;
    exception: (exceptionId: string) => void;
    adapter: Adapter<any, any>;
}>;
