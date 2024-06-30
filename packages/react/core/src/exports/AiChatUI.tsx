import {ReactElement} from 'react';
import {Loader} from './elements/Loader';
import {Greeting} from './elements/Greeting';

export type AiChatUIOverrides = {
    Loader: ReactElement;
    Greeting?: ReactElement;
}

/**
 * Wrapper for possible UI components that can be overridden in the default NLUX chat components.
 */
export const AiChatUI = {
    Loader,
    Greeting,
};
