import {ChatAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';

export const getRunnableNameToUse = <AnyAiMsg>(adapterOptions: ChatAdapterOptions<AnyAiMsg>): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const runnableName = baseUrl.split('/').pop();
    return runnableName || 'langserve-runnable';
};
