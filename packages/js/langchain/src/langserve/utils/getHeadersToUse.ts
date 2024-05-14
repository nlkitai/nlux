import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeHeaders} from '../types/langServe';

export const getHeadersToUse = <AnyAiMsg>(
    adapterOptions: ChatAdapterOptions<AnyAiMsg>,
): LangServeHeaders => {
    return adapterOptions.headers || {};
};