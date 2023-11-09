import {Observable} from '../../../core/bus/observable';
import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxError} from '../../../core/error';
import {defaultAdapterExceptionId} from '../../../exceptions/exceptions';
import {NluxContext} from '../../../types/context';
import {debug} from '../../../x/debug';
import {renderTextMessage} from './render';
import {CompTextMessageActions, CompTextMessageElements, CompTextMessageEvents, CompTextMessageProps} from './types';
import {updateTextMessage} from './update';

const appendIntervalInMilliseconds = 200;

@Model('text-message', renderTextMessage, updateTextMessage)
export class CompTextMessage extends BaseComp<
    CompTextMessageProps, CompTextMessageElements, CompTextMessageEvents, CompTextMessageActions
> {
    // IMPORTANT: When the component is created, it's in loading state. It's changed to loaded state asynchronously.
    // When 'content' prop is provided, the contentStatus changes to 'loaded' instantly but also asynchronously.
    // When the content is set via 'contentPromise' or 'contentStream', the loadingStatus is changed to loaded
    // when the promise is resolved or when the stream emits the last value.
    private readonly contentLoadingModeFromProps: 'promise' | 'stream' | 'static';
    // When contentStatus switches to 'loaded', there is a gurantee that 'content' is set to a string value.
    private content?: string;
    private contentStatus: 'loading' | 'streaming' | 'loaded' | 'loading-error' = 'loading';
    private contentStatusUpdateListeners: Set<Function> = new Set();
    private contentToAppend: string[] = [];
    private lastAppendTimestamp: number = 0;

    private resizeListeners: Set<Function> = new Set();
    private shouldKeepVisibleWhenGeneratingContent: boolean = false;

    constructor(context: NluxContext, props: CompTextMessageProps) {
        if (!props.content && !props.contentPromise && !props.contentStream) {
            throw new Error(`CompTextMessage: content, contentPromise or contentStream must be provided!`);
        }

        if ([props.content, props.contentPromise, props.contentStream].filter(Boolean).length > 1) {
            throw new Error(`CompTextMessage: only one of content, contentPromise or contentStream must be provided!`);
        }

        super(context, props);

        if (props.onMessageStatusUpdated) {
            this.contentStatusUpdateListeners.add(props.onMessageStatusUpdated);
        }

        // Initial loadingStatus is always 'loading'
        this.setContentLoadingStatus('loading');

        setTimeout(() => {
            this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'loading'));
        }, 0);

        // Change content loadingStatus to 'loaded' if the content is actually provided.
        // Do it, asynchronously via setTimeout because other components expect message to be in loading
        // when it's constructed (ref guarantee in doc comments above 'content' and 'contentStatus' props).
        setTimeout(() => {
            if (typeof props.content === 'string') {
                this.setContentLoadingStatus('loaded');
                this.content = props.content;
                this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'loaded'));
                this.cleanupContentStatusUpdateListeners();
            }
        }, 0);

        // Handle content loaded asynchronously via promise.
        if (props.contentPromise) {
            this.listenToContentGenerationPromise(props.contentPromise);
            this.contentLoadingModeFromProps = 'promise';
        } else {
            // Handle content loaded asynchronously via stream.
            if (props.contentStream) {
                this.listenToContentGenerationStream(props.contentStream);
                this.contentLoadingModeFromProps = 'stream';
            } else {
                this.contentLoadingModeFromProps = 'static';
            }
        }
    }

    public get contentLoaded(): boolean {
        return this.contentStatus === 'loaded';
    }

    public get contentLoadingMode(): 'promise' | 'stream' | 'static' {
        return this.contentLoadingModeFromProps;
    }

    public destroy() {
        this.resizeListeners.clear();
        this.cleanupContentStatusUpdateListeners();
        super.destroy();
    }

    public markAsErred() {
        this.setProp('erred', true);
    }

    public markAsRead() {
        this.setProp('read', true);
    }

    public markAsSent() {
        this.setProp('sent', true);
    }

    onResize(listener: Function) {
        this.resizeListeners.add(listener);
    }

    removeResizeListener(listener: Function) {
        this.resizeListeners.delete(listener);
    }

    public scrollToMessage() {
        this.executeDomAction('scrollToMessageEndContainer');
    }

    private appendText(text: string[]) {
        // TODO - Update to handle markdown and html
        this.executeDomAction('appendText', text);

        // TODO - Better handling of content tracked in message
        // TODO - Maybe no need to keep it in memory ? and copy from DOM when needed
        this.content += text.join('');
    }

    private bufferAndAppendText(text: string) {
        this.contentToAppend.push(text);
        const now = Date.now();
        if (now - this.lastAppendTimestamp > appendIntervalInMilliseconds) {
            this.appendText(this.contentToAppend);
            this.contentToAppend = [];
            this.lastAppendTimestamp = now;
        }
    }

    private bufferClear() {
        if (this.contentToAppend) {
            this.appendText(this.contentToAppend);
            this.contentToAppend = [];
        }

        this.lastAppendTimestamp = 0;
    }

    private cleanupContentStatusUpdateListeners() {
        this.contentStatusUpdateListeners.forEach(listener => listener(this.id, this.contentStatus));
    }

    @CompEventListener('copy-to-clipboard-triggered')
    private handleCompCopyToClipboardTriggered(event: ClipboardEvent) {
        event.preventDefault();
        if (this.content) {
            debug(`Copying selected message to clipboard!`);
            navigator.clipboard.writeText(this.content);
        }
    }

    private handleContentLoadingError(source?: string, errorMessage?: string) {
        this.setContentLoadingStatus('loading-error');
    }

    @CompEventListener('message-container-resized')
    private handleResize() {
        this.resizeListeners.forEach(listener => listener());
    }

    private listenToContentGenerationPromise(contentPromise: Promise<string>) {
        contentPromise.then((content) => {
            this.appendText([content]);
            this.content = content;
            this.setContentLoadingStatus('loaded');
            this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'loaded'));
            this.cleanupContentStatusUpdateListeners();
        }).catch((error) => {
            this.handleContentLoadingError(
                'contentPromise',
                error?.toString() || 'Failed to load content',
            );

            if (typeof error.exceptionId === 'string') {
                this.context.exception(error.exceptionId);
            } else {
                this.context.exception(defaultAdapterExceptionId);
            }

            this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'error'));
            this.cleanupContentStatusUpdateListeners();
        });
    }

    private listenToContentGenerationStream(contentStream: Observable<string>) {
        this.setContentLoadingStatus('streaming');
        this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'streaming'));

        const renderingStream = new Observable<string>();
        this.executeDomAction('subscribeToContentStream', contentStream);

        contentStream.subscribe({
            next: (content) => {
                renderingStream.next(content);
            },
            error: (error: NluxError) => {
                renderingStream.error(error);
                this.setProp('erred', true);

                this.handleContentLoadingError(
                    'contentStream',
                    error?.toString() || 'Failed to load content',
                );

                if (typeof error.exceptionId === 'string') {
                    this.context.exception(error.exceptionId);
                } else {
                    this.context.exception(defaultAdapterExceptionId);
                }

                this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'error'));
                this.cleanupContentStatusUpdateListeners();
            },
            complete: () => {
                renderingStream.complete();
                this.setContentLoadingStatus('loaded');
                this.contentStatusUpdateListeners.forEach(listener => listener(this.id, 'loaded'));
                this.cleanupContentStatusUpdateListeners();
            },
        });
    }

    private setContentLoadingStatus(status: 'loading' | 'streaming' | 'loaded' | 'loading-error') {
        this.contentStatus = status;
        this.setProp('loadingStatus', status);
    }
}
