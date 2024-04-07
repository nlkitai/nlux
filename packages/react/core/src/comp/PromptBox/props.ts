import {PromptBoxStatus} from '@nlux/core';

export type PromptBoxProps = {
    status: PromptBoxStatus;
    prompt?: string;
    placeholder?: string;
    autoFocus?: boolean;

    hasValidInput?: boolean;

    onChange?: (value: string) => void;
    onSubmit?: () => void;
};
