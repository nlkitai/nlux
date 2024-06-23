import {MessageOptions as JavaScriptMessageOptions} from '@nlux/core';
import {FC, RefObject} from 'react';
import {StreamedServerComponent} from '@shared/types/adapters/chat/serverComponentChatAdapter';

/**
 * Props for the custom React component that renders a message sent by the server.
 * @template AiMsg The type of the message received from the AI. Defaults to string for standard NLUX adapters.
 *
 * @property {string} uid The unique identifier of the message.
 * @property {'stream' | 'batch'} dataTransferMode The data transfer mode used by the adapter.
 * @property {'streaming' | 'complete'} status The status of the message. It's always 'complete' for batch mode.
 *
 * @property {AiMsg} content The content of the message. It's updated as the message is being streamed. The content is
 * an array of messages when the data transfer mode is 'stream'. The content is an array with a single message when the
 * data transfer mode is 'batch'.
 *
 * @property {unknown[]} serverResponse The raw server response. The server response is an array of objects or strings
 * representing each raw chunk of the response received from the server. The server response is only provided with
 * NLUX standard adapters. For custom adapters, everything is handled through the content prop and it will be empty.
 *
 * @property {StreamedServerComponent} [serverComponent] The server component to render. This is only provided when
 * <AiChat /> is used with a server-rendered UI component such as a React Server Component (RSC).
 *
 * @property {RefObject<never>} containerRef If you opt for the NLUX markdown renderer, you can use this reference to
 * attach the rendered content to the DOM. Otherwise, you can ignore this prop and render the `content` directly.
 */
export type ResponseRendererProps<AiMsg> = {
    uid: string;
    dataTransferMode: 'stream' | 'batch';
    status: 'streaming' | 'complete';
    contentType: 'text' | 'server-component';
    content: AiMsg[];
    serverComponent?: StreamedServerComponent;
    serverResponse: unknown[];
    containerRef?: RefObject<never>;
};

export type ResponseRenderer<AiMsg> = FC<ResponseRendererProps<AiMsg>>;

export type PromptRendererProps = {
    uid: string;
    prompt: string;
};

export type PromptRenderer = FC<PromptRendererProps>;

export type ReactSpecificMessageOptions<AiMsg> = {
    /**
     * Custom React component to render the message received from the AI.
     */
    responseRenderer?: ResponseRenderer<AiMsg>;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptRenderer?: PromptRenderer;
};

/**
 * Options for a message in the conversation.
 * We use all options from @nlux/core except the React-specific options
 * defined in ReactSpecificMessageOptions.
 */
export type MessageOptions<AiMsg = string> =
    Omit<JavaScriptMessageOptions<AiMsg>, 'responseRenderer' | 'promptRenderer'>
    & ReactSpecificMessageOptions<AiMsg>;
