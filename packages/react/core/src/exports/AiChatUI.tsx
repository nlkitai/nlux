import {ReactElement} from 'react'
import {Greeting} from './elements/Greeting'
import {Loader} from './elements/Loader'
import {Composer} from './elements/Composer'
export type AiChatUIOverrides = {
    Loader: ReactElement
    Greeting?: ReactElement
    Composer?: ReactElement
}

/**
 * Wrapper for possible UI components that can be overridden in the default NLUX chat components.
 */
export const AiChatUI = {
    Loader,
    Greeting,
    Composer,
};
