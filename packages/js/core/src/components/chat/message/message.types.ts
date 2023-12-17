// Possible values for 'static' content: Loading, Loaded.
export type MessageStaticContentStatus = 'loading' | 'loaded';

// Possible values for 'stream' content: Streaming, Loaded, LoadingError.
export type MessageStreamContentStatus = 'connecting' | 'streaming' | 'loaded' | 'loading-error';

// Possible values for 'promise' content: Loading, Loaded, LoadingError.
export type MessagePromiseContentStatus = 'loading' | 'loaded' | 'loading-error';

export type MessageContentLoadingStatus =
    MessageStaticContentStatus
    | MessageStreamContentStatus
    | MessagePromiseContentStatus;

// Static message doesn't change once the message is rendered.
// Stream will open a markdown stream and render the content as it comes.
export type MessageContentType = 'static' | 'stream' | 'promise';

export type CompMessageEvents = 'copy-to-clipboard-triggered'
    | 'message-container-resized'
    | 'message-container-dom-changed';

export type CompMessageProps = Readonly<{
    format: 'text' | 'markdown' | 'html';
    direction: 'in' | 'out';
    loadingStatus: MessageContentLoadingStatus;
    content?: string;
    contentType: MessageContentType;
    createdAt: Date;
    trackResize: boolean;
    trackDomChange: boolean;
}>;

export type CompMessageElements = Readonly<{
    container: HTMLElement;
    contentContainer: HTMLElement;
    loader: HTMLElement | undefined;
}>;

export type CompMessageActions = Readonly<{
    focus: () => void;
    setContentStatus: (status: MessageContentLoadingStatus) => void;
    appendContent: (content: string) => void;
    commitContent: () => void;
}>;
