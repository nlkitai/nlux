export type ComposerStatus =
    'typing'
    | 'submitting-prompt'
    | 'submitting-conversation-starter'
    | 'submitting-edit'
    | 'submitting-external-message'
    | 'waiting';

/**
 * Options for the Composer DOM component.
 */
export type ComposerProps = {
    status: ComposerStatus;
    message?: string;
    placeholder?: string;
    autoFocus?: boolean;

    /**
     * This will override the disabled state of the submit button when the composer is in 'typing' status.
     * It will not have any impact in the composer 'submitting-prompt', 'submitting-conversation-starter',
     * 'submitting-external-message', and 'waiting' statuses, as the submit button is always disabled in
     * these statuses.
     *
     * Default: Submit button is only enabled when the message is not empty.
     */
    disableSubmitButton?: boolean;

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
};
