import {ContextAdapter} from '@nlux/core';
import {Context, ReactNode} from 'react';

export type AiContextData = {
    contextId: string;
    adapter: ContextAdapter;
    data: {
        [key: string]: any;
    };
    registeredTaskCallbacks: {
        [key: string]: Function;
    };
};

export type AiContextProviderProps = {
    value?: {
        [key: string]: any;
    };
    children: ReactNode;
};

export type AiContext = {
    Provider: (props: AiContextProviderProps) => ReactNode;
    ref: Context<AiContextData>;
};
