import {LangServeAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';

export const getRunnableNameToUse = (adapterOptions: LangServeAdapterOptions): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const runnableName = baseUrl.split('/').pop();
    return runnableName || 'langserve-runnable';
};
