import {DataTransferMode} from '@nlux/core';
import {LangServeEndpointType} from '../types/langServe';

export const getDataTransferModeFromEndpointType = (
    endpointAction: LangServeEndpointType,
): DataTransferMode => {
    if (endpointAction === 'stream') {
        return 'stream';
    }

    return 'fetch';
};
