import {ComposerProps} from '../../../../../../shared/src/ui/Composer/props';

export type CompComposerEvents = 'text-updated'
    | 'send-message-clicked'
    | 'escape-key-pressed'
    | 'enter-key-pressed'
    | 'command-enter-key-pressed';

export type CompComposerProps = Readonly<{
    domCompProps: ComposerProps;
}>;

export type CompComposerEventListeners = Partial<{
    onTextUpdated: (newValue: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}>;

export type CompComposerElements = Readonly<{
    root: HTMLElement;
    textInput: HTMLTextAreaElement;
    sendButton: HTMLButtonElement;
}>;

export type CompComposerActions = Readonly<{
    focusTextInput: () => void;
}>;
