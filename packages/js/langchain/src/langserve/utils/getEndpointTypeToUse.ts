import {ChatAdapterOptions} from '../types/adapterOptions';
import {LangServeEndpointType} from '../types/langServe';
import {getDataTransferModeToUse} from './getDataTransferModeToUse';
import {getEndpointTypeFromUrl} from './getEndpointTypeFromUrl';

export const getEndpointTypeToUse = <MessageType>(
    adapterOptions: ChatAdapterOptions<MessageType>,
): LangServeEndpointType => {
    const urlFromOptions = adapterOptions.url;
    const actionFromUrl = getEndpointTypeFromUrl(urlFromOptions);
    if (actionFromUrl) {
        return actionFromUrl;
    }

    const dataTransferMode = getDataTransferModeToUse(adapterOptions);
    return dataTransferMode === 'fetch' ? 'invoke' : 'stream';
};
