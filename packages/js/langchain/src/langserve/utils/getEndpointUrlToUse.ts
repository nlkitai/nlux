import {LangServeAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';
import {getEndpointTypeToUse} from './getEndpointTypeToUse';

export const getEndpointUrlToUse = (adapterOptions: LangServeAdapterOptions): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const endpointType = getEndpointTypeToUse(adapterOptions);
    return `${baseUrl}/${endpointType}`;
};
