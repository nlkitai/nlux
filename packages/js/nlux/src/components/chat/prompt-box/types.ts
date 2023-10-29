export type CompPromptBoxEvents = 'text-updated'
    | 'send-message-clicked'
    | 'escape-key-pressed'
    | 'enter-key-pressed';

export type CompPromptBoxProps = Readonly<{
    enableTextInput: boolean;
    enableSendButton: boolean;
    textInputValue: string;
    placeholder?: string;
    autoFocus?: boolean;
}>;

export type CompPromptBoxEventListeners = Partial<{
    onTextUpdated: (newValue: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}>;

export type CompPromptBoxElements = Readonly<{
    textInput: HTMLTextAreaElement;
    sendButton: HTMLButtonElement;
}>;

export type CompPromptBoxActions = Readonly<{
    focusTextInput: () => void;
}>;
