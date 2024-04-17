import {AnyAiMsg} from '../../../../../shared/src/types/anyAiMsg';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';
import {getEndpointTypeToUse} from './getEndpointTypeToUse';

export const getEndpointUrlToUse = (
    adapterOptions: ChatAdapterOptions<AnyAiMsg>,
): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    const endpointType = getEndpointTypeToUse(adapterOptions);
    return `${baseUrl}/${endpointType}`;
};
