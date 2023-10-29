export type CompTextMessageEvents = 'copy-to-clipboard-triggered'
    | 'message-container-resized';

export type CompTextMessageProps = Readonly<{
    format: 'text' | 'markdown' | 'html';
    direction: 'in' | 'out';
    initialContent: string;
    createdAt: Date;
    sent?: boolean;
    read?: boolean;
    erred?: boolean;
    messagesMaxHeight?: number;
}>;

export type CompTextMessageElements = Readonly<{
    container: HTMLElement;
    contentContainer: HTMLElement;
}>;

export type CompTextMessageActions = Readonly<{
    focus: () => void;
    appendText: (text: string) => void;
    scrollToMessageEndContainer: () => void;
}>;
