export type PromptBoxStatus = 'typing' | 'submitting' | 'waiting';

/**
 * Options for the PromptBox DOM component.
 */
export type PromptBoxProps = {
    status: PromptBoxStatus;
    message?: string;
    placeholder?: string;
    autoFocus?: boolean;

    /**
     * This will override the disabled state of the submit button when the prompt box is in 'typing' status.
     * It will not have any impact in the prompt box 'submitting' and 'waiting' statuses, as the submit button
     * is always disabled in these statuses.
     *
     * Default: Submit button is only enabled when the message is not empty.
     */
    disableSubmitButton?: boolean;
};
