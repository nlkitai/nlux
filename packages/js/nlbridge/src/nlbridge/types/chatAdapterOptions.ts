import {AiContext as CoreAiContext} from '@nlux/core';

export type ChatAdapterUsageMode = 'chat' | 'copilot';

export type ChatAdapterOptions = {
    /**
     * The URL of the NLBridge endpoint.
     *
     */
    url: string;

    /**
     * Indicates the usage mode of the adapter
     *
     * - When set to 'copilot', the adapter will additionally check for tasks that can be executed and trigger them.
     * - In copilot mode, data cannot be streamed and will be fetched in one request instead.
     * - The copilot mode requires the presence of a context. If not provided, the adapter will use 'chat' mode.
     *
     * Default: 'chat'
     */
    mode?: ChatAdapterUsageMode;

    /**
     * The context ID to use when communicating with NLBridge.
     * Optional. If not provided, the adapter will not use a context.
     */
    context?: CoreAiContext;
};
