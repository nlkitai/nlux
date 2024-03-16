import {AiContext as CoreAiContext, ContextItems} from '@nlux/core';
import {Context, ReactNode} from 'react';

export type AiContextProviderProps = {
    initialContext?: ContextItems;
    children: ReactNode;
};

export type AiContext = {
    Provider: (props: AiContextProviderProps) => ReactNode;
    ref: Context<CoreAiContext>;
};
