import {ContextData} from './data';

export type GetContextDataResult = {
    success: true;
    data: ContextData | undefined;
} | {
    success: false;
    error: string;
};

export type GetContextDataCallback = (
    contextId: string,
    itemId: string | undefined,
) => Promise<GetContextDataResult>;
