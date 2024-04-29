import {MessageOptions as JavascriptMessageOptions} from '@nlux/core';
import {FunctionComponent, RefObject} from 'react';

export type ResponseComponentProps<AiMsg> = {
    uid: string;
    status: 'streaming' | 'complete';
    response?: AiMsg;
    containerRef: RefObject<any>;
};

export type ResponseComponent<AiMsg> = FunctionComponent<ResponseComponentProps<AiMsg>>;

export type PromptComponentProps = {
    uid: string;
    prompt: string;
};

export type PromptComponent = FunctionComponent<PromptComponentProps>;

export type ReactSpecificMessageOptions<AiMsg> = {
    /**
     * Custom React component to render the message received from the AI.
     */
    responseComponent?: ResponseComponent<AiMsg>;

    /**
     * Custom React component to render the message sent by the user.
     */
    promptComponent?: PromptComponent;
};

/**
 * Options for a message in the conversation.
 * We use all options from @nlux/core except the React-specific options
 * defined in ReactSpecificMessageOptions.
 */
export type MessageOptions<AiMsg> =
    Omit<JavascriptMessageOptions<AiMsg>, 'responseRenderer' | 'promptRenderer'>
    & ReactSpecificMessageOptions<AiMsg>;
