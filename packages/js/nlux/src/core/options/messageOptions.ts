export interface MessageOptions {
    /**
     * Indicates whether the selected message should be copied when the user presses Ctrl+C. This only works if the
     * message is selectable.
     * @default true
     */
    copyable?: boolean;

    /**
     * Indicates whether the message should be selectable when the user clicks on it, or when tabbing through the
     * conversation.
     * @default true
     */
    selectable?: boolean;
}
