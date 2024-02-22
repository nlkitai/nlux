import {ContextData} from './data';

export type UpdateContextResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type UpdateContextCallback = (
    contextId: string,
    data: ContextData | null,
) => Promise<UpdateContextResult>;
