import {LangServeEndpointType} from '../types/langServe';

export const getEndpointTypeFromUrl = (url: string): LangServeEndpointType | undefined => {
    const regEx = /\/.*\/(invoke|stream)$/g;
    const match = regEx.exec(url);
    if (!match || match.length < 2) {
        return undefined;
    }

    const extractedEndpoint = match[1];
    if (extractedEndpoint === 'invoke' || extractedEndpoint === 'stream') {
        return extractedEndpoint;
    }

    return undefined;
};
