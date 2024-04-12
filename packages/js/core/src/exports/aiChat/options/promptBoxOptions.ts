export interface PromptBoxOptions {
    /**
     * Indicates whether the prompt input field should be focused when the prompt is shown.
     * @default false
     */
    autoFocus?: boolean;

    /**
     * This will override the disabled state of the submit button when the prompt box is in 'typing' status.
     * It will not have any impact in the prompt box 'submitting' and 'waiting' statuses, as the submit button
     * is always disabled in these statuses.
     *
     * Default: Submit button is only enabled when the message is not empty.
     */
    disableSubmitButton?: boolean;

    /**
     * The placeholder message to be displayed in the prompt input field when empty.
     */
    placeholder?: string;
}
