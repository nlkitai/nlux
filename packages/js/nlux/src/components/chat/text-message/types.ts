import {Observable} from '../../../core/bus/observable.ts';

export type TextMessageContentLoadingStatus = 'loading' | 'streaming' | 'loaded' | 'error';

export type CompTextMessageEvents = 'copy-to-clipboard-triggered'
    | 'message-container-resized';

export type CompTextMessageProps = Readonly<{
    format: 'text' | 'markdown' | 'html';
    direction: 'in' | 'out';
    content?: string;
    contentPromise?: Promise<string>;
    contentStream?: Observable<string>;
    createdAt: Date;
    sent?: boolean;
    read?: boolean;
    erred?: boolean;
    messagesMaxHeight?: number;
    onMessageStatusUpdated?: (messageId: string, status: TextMessageContentLoadingStatus) => void;
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
