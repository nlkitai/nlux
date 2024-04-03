import {ChatAdapter, ChatAdapterBuilder, PromptBoxOptions, PromptBoxStatus} from '@nlux/core';

export type PromptBoxProps = {
    status: PromptBoxStatus;
    prompt?: string;
    placeholder?: string;
    canSubmit?: boolean;

    onChange?: (value: string) => void;
    onSubmit?: () => void;
};

export type PromptBoxControllerProps = {
    adapter: ChatAdapter | ChatAdapterBuilder;
    promptBoxOptions?: PromptBoxOptions;
};
