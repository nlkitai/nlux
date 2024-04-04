import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeHeaders} from '../types/langServe';

export const getHeadersToUse = (
    adapterOptions: ChatAdapterOptions,
): LangServeHeaders => {
    return adapterOptions.headers || {};
};