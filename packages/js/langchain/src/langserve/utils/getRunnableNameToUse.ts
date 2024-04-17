import {AnyAiMsg} from '../../../../../shared/src/types/anyAiMsg';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';

export const getRunnableNameToUse = (adapterOptions: ChatAdapterOptions<AnyAiMsg>): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const runnableName = baseUrl.split('/').pop();
    return runnableName || 'langserve-runnable';
};
