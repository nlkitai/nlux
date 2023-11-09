import {Observable} from '../../../core/bus/observable';

export type TextMessageContentLoadingStatus = 'loading' | 'streaming' | 'loaded' | 'loading-error';

export type CompTextMessageEvents = 'copy-to-clipboard-triggered'
    | 'message-container-resized';

export type CompTextMessageProps = Readonly<{
    format: 'text' | 'markdown' | 'html';
    direction: 'in' | 'out';
    loadingStatus: TextMessageContentLoadingStatus;
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
    setLoadingStatus: (status: TextMessageContentLoadingStatus) => void;
    subscribeToContentStream: (contentStream: Observable<string>) => void;
    unsubscribeFromContentStream: () => void;
}>;
