import {DataTransferMode} from '@nlux/core';

export type NlBridgeAdapterOptions = {
    /**
     * The URL of the NlBridge endpoint.
     *
     */
    url: string;

    /**
     * The data transfer mode to use when communicating with NlBridge.
     * If not provided, the adapter will use `stream` mode.
     */
    dataTransferMode?: DataTransferMode;
};
