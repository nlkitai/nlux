import {ChatAdapterOptions} from '../types/adapterOptions';
import {isUrlWithSupportedEndpoint} from './isUrlWithSupportedEndpoint';

/**
 * When the URL provided by the user does not end with /invoke or /stream we assume that the user has provided
 * the base URL. When the URL provided does end with /invoke or /stream, we assume that the user has provided the
 * endpoint URL, and we strip the endpoint type from it.
 *
 * Examples:
 *
 * For the URL: https://pynlux.api.nlkit.com/einbot/stream
 * The base URL is: https://pynlux.api.nlkit.com/einbot
 *
 * For the URL: https://pynlux.api.nlkit.com/einbot
 * The base URL is also: https://pynlux.api.nlkit.com/einbot
 * Since it does not end with /invoke or /stream.
 */
export const getBaseUrlFromUrlOption = <AnyAiMsg>(adapterOptions: ChatAdapterOptions<AnyAiMsg>): string => {
    const urlOption = adapterOptions.url;
    if (!isUrlWithSupportedEndpoint(urlOption)) {
        return urlOption;
    }

    return urlOption.replace(/\/(invoke|stream)$/g, '');
};
