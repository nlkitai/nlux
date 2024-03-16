import {AiContext as CoreAiContext, DataTransferMode} from '@nlux/core';

export type ChatAdapterOptions = {
    /**
     * The URL of the NLBridge endpoint.
     *
     */
    url: string;

    /**
     * The data transfer mode to use when communicating with NLBridge.
     * If not provided, the adapter will use `stream` mode.
     */
    dataTransferMode?: DataTransferMode;

    /**
     * The context ID to use when communicating with NLBridge.
     * Optional. If not provided, the adapter will not use a context.
     */
    context?: CoreAiContext;
};
