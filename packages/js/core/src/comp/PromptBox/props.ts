export type PromptBoxStatus = 'typing' | 'submitting' | 'waiting';

export type PromptBoxProps = {
    status: PromptBoxStatus;
    message?: string;
    placeholder?: string;
    autoFocus?: boolean;
};
