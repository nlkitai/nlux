// Possible values for 'static' content: Loading, Loaded.
// Possible values for 'stream' content: Streaming, Loaded, LoadingError.
// Possible values for 'promise' content: Loading, Loaded, LoadingError.
export type MessageContentLoadingStatus = 'loading' | 'streaming' | 'loaded' | 'loading-error';

// Static message doesn't change once the message is rendered.
// Stream will open a markdown stream and render the content as it comes.
export type MessageContentType = 'static' | 'stream' | 'promise';

export type CompMessageEvents = 'copy-to-clipboard-triggered'
    | 'message-container-resized';

export type CompMessageProps = Readonly<{
    format: 'text' | 'markdown' | 'html';
    direction: 'in' | 'out';
    loadingStatus?: MessageContentLoadingStatus;
    content?: string;
    contentType: MessageContentType;
    createdAt: Date;
}>;

export type CompMessageElements = Readonly<{
    container: HTMLElement;
    contentContainer: HTMLElement;
}>;

export type CompMessageActions = Readonly<{
    focus: () => void;
    setContentStatus: (status: MessageContentLoadingStatus) => void;
    appendContent: (content: string) => void;
    commitContent: () => void;
}>;
