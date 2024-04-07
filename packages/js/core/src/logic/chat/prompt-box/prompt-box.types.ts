import {PromptBoxProps} from '../../../ui/PromptBox/props';

export type CompPromptBoxEvents = 'text-updated'
    | 'send-message-clicked'
    | 'escape-key-pressed'
    | 'enter-key-pressed';

export type CompPromptBoxProps = Readonly<{
    domCompProps: PromptBoxProps;
}>;

export type CompPromptBoxEventListeners = Partial<{
    onTextUpdated: (newValue: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}>;

export type CompPromptBoxElements = Readonly<{
    root: HTMLElement;
    textInput: HTMLTextAreaElement;
    sendButton: HTMLButtonElement;
}>;

export type CompPromptBoxActions = Readonly<{
    focusTextInput: () => void;
}>;
