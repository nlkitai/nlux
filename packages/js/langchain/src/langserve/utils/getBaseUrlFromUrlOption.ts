import {LangServeAdapterOptions} from '../types/adapterOptions';
import {isUrlWithSupportedEndpoint} from './isUrlWithSupportedEndpoint';

/**
 * When the URL provided by the user does not end with /invoke or /stream we assume that the user has provided
 * the base URL. When the URL provided does end with /invoke or /stream, we assume that the user has provided the
 * endpoint URL and we strip the endpoint type from it.
 *
 * Examples:
 *
 * For the URL: https://pynlux.api.nlux.ai/einbot/stream
 * The base URL is: https://pynlux.api.nlux.ai/einbot
 *
 * For the URL: https://pynlux.api.nlux.ai/einbot
 * The base URL is also: https://pynlux.api.nlux.ai/einbot
 * Since it does not end with /invoke or /stream.
 */
export const getBaseUrlFromUrlOption = (adapterOptions: LangServeAdapterOptions): string => {
    const urlOption = adapterOptions.url;
    if (!isUrlWithSupportedEndpoint(urlOption)) {
        return urlOption;
    }

    return urlOption.replace(/\/(invoke|stream)$/g, '');
};
