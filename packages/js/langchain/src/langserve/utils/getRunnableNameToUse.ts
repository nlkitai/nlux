import {ChatAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';

export const getRunnableNameToUse = (adapterOptions: ChatAdapterOptions): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const runnableName = baseUrl.split('/').pop();
    return runnableName || 'langserve-runnable';
};
