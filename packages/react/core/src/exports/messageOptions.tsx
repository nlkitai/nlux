import {MessageOptions as JavascriptMessageOptions} from '@nlux/core';
import {FunctionComponent} from 'react';

export type ReactSpecificMessageOptions<AiMsg> = {
    /**
     * Custom React component to render the message received from the AI.
     */
    responseComponent?: FunctionComponent<{response: AiMsg}>;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptComponent?: FunctionComponent<{prompt: string}>;
};

/**
 * Options for a message in the conversation.
 * We use all options from @nlux/core except the React-specific options
 * defined in ReactSpecificMessageOptions.
 */
export type MessageOptions<AiMsg> =
    Omit<JavascriptMessageOptions<AiMsg>, keyof ReactSpecificMessageOptions<AiMsg>>
    & ReactSpecificMessageOptions<AiMsg>;
