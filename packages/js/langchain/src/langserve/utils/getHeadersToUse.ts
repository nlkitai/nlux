import {AnyAiMsg} from '../../../../../shared/src/types/anyAiMsg';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeHeaders} from '../types/langServe';

export const getHeadersToUse = (
    adapterOptions: ChatAdapterOptions<AnyAiMsg>,
): LangServeHeaders => {
    return adapterOptions.headers || {};
};