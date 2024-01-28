import {LangServeAdapterOptions} from '../types/adapterOptions';
import {getBaseUrlFromUrlOption} from './getBaseUrlFromUrlOption';

export const getSchemaUrlToUse = (adapterOptions: LangServeAdapterOptions, type: 'input' | 'output'): string => {
    const baseUrl = getBaseUrlFromUrlOption(adapterOptions).replace(/\/$/, '');
    if (type === 'input') {
        return `${baseUrl}/input_schema`;
    }

    return `${baseUrl}/output_schema`;
};
