import {Loader} from './elements/Loader';
import {ReactElement} from 'react';

export type AiChatUIOverrides = {
    Loader: ReactElement;
}

/**
 * Wrapper for possible UI components that can be overridden in the default NLUX chat components.
 */
export const AiChatUI = {
    Loader,
};
