import {PromptBoxStatus} from '@nlux-dev/core/src/comp/PromptBox/props';
import {ChatAdapter, ChatAdapterBuilder, PromptBoxOptions} from '@nlux/core';

export type PromptBoxProps = {
    status: PromptBoxStatus;
    prompt?: string;
    placeholder?: string;
    canSubmit?: boolean;

    onChange?: (value: string) => void;
    onSubmit?: () => void;
    onFocus?: () => void;
};

export type PromptBoxControllerProps = {
    adapter: ChatAdapter | ChatAdapterBuilder;
    promptBoxOptions?: PromptBoxOptions;
};
