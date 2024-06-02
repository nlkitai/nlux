export interface ComposerOptions {
    /**
     * Indicates whether the prompt input field should be focused when the prompt is shown.
     * @default false
     */
    autoFocus?: boolean;

    /**
     * This will override the disabled state of the submit button when the composer is in 'typing' status.
     * It will not have any impact in the composer 'submitting-prompt' and 'waiting' statuses, as the submit button
     * is always disabled in these statuses.
     *
     * @default: Submit button is only enabled when the message is not empty.
     */
    disableSubmitButton?: boolean;

    /**
     * The placeholder message to be displayed in the prompt input field when empty.
     */
    placeholder?: string;

    /**
     * The shortcut to submit the prompt message.
     *
     * - `Enter`: The user can submit the prompt message by pressing the `Enter` key. In order to add a new line, the
     * user can press `Shift + Enter`.
     * - `CommandEnter`: When this is used, the user can submit the prompt message by pressing `Ctrl + Enter` on
     * Windows/Linux or `Cmd + Enter` on macOS. In order to add a new line, the user can press `Enter`.
     *
     * @default 'Enter'
     */
    submitShortcut?: 'Enter' | 'CommandEnter';
}
