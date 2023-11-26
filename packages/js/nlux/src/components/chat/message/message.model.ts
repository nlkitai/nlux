import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {Message} from '../../../types/message';
import {debug, warn} from '../../../x/debug';
import {renderMessage} from './message.render';
import {
    CompMessageActions,
    CompMessageElements,
    CompMessageEvents,
    CompMessageProps,
    MessageContentLoadingStatus,
    MessageContentType,
} from './message.types';
import {updateMessage} from './message.update';

@Model('message', renderMessage, updateMessage)
export class CompMessage extends BaseComp<
    CompMessageProps, CompMessageElements, CompMessageEvents, CompMessageActions
> {
    private readonly contentType: MessageContentType;
    private content?: string;
    private contentStatus: MessageContentLoadingStatus;

    private resizeListeners: Set<Function> = new Set();

    constructor(context: NluxContext, props: CompMessageProps) {
        super(context, props);

        this.content = props.content;
        this.contentType = props.contentType;
        this.contentStatus = this.contentType === 'stream' ? 'streaming' : 'loading';

        setTimeout(() => {
            // Handle the case when the content provide is static and doesn't require any streaming.
            if (props.contentType === 'static') {
                this.setContentLoadingStatus('loaded');
                return;
            }

            // Calling this to update the dom class once the component is constructed.
            this.setProp('loadingStatus', this.contentStatus);
        }, 0);
    }

    /**
     * Called to append content to the message, when the content is provided via stream.
     * @param {string} content
     */
    public appendContent(content: string) {
        if (this.contentType !== 'stream') {
            throw new Error(`CompMessage: content can only be appended when contentType is 'stream'!`);
        }

        if (this.contentStatus !== 'streaming') {
            throw new Error(`CompMessage: content can only be appended when contentStatus is 'loading' or 'streaming'!`);
        }

        this.executeDomAction('appendContent', content);
    }

    /**
     * Called to commit the content and close the stream when the content is provided via stream.
     * Once this is called, the content cannot be appended anymore.
     * It should be called when the stream is closed.
     */
    public commitContent() {
        if (this.contentType !== 'stream') {
            throw new Error(`CompMessage: content can only be committed when contentType is 'stream'!`);
        }

        if (this.contentStatus !== 'streaming') {
            throw new Error(`CompMessage: content can only be committed when contentStatus is 'streaming'!`);
        }

        this.executeDomAction('commitContent');
        this.setContentLoadingStatus('loaded');
    }

    public destroy() {
        this.resizeListeners.clear();
        super.destroy();
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

    /**
     * Called to set the content when the content is provided via promise.
     * It should be called when the promise is resolved.
     * @param {string} content
     */
    public setContent(content: Message) {
        if (this.contentType !== 'promise') {
            throw new Error(`CompMessage: content can only be set when contentType is 'promise'!`);
        }

        if (this.contentStatus !== 'loading') {
            throw new Error(`CompMessage: content can only be set when contentStatus is 'loading'!`);
        }

        this.content = content;
        this.setContentLoadingStatus('loaded');
        this.executeDomAction('appendContent', content);
    }

    public setErrored() {
        if (this.contentStatus !== 'loading' && this.contentStatus !== 'streaming') {
            throw new Error(`CompMessage: content can only be errored when contentStatus is 'loading' or 'streaming'!`);
        }

        this.setContentLoadingStatus('loading-error');
    }

    @CompEventListener('copy-to-clipboard-triggered')
    private handleCompCopyToClipboardTriggered(event: ClipboardEvent) {
        event.preventDefault();
        if (this.content) {
            debug(`Copying selected message to clipboard!`);
            navigator.clipboard.writeText(this.content).catch(error => {
                warn('Failed to copy selected message to clipboard!');
                debug(error);
            });
        }
    }

    @CompEventListener('message-container-resized')
    private handleResize() {
        this.resizeListeners.forEach(listener => listener());
    }

    private setContentLoadingStatus(status: 'loading' | 'streaming' | 'loaded' | 'loading-error') {
        if (this.contentStatus === status) {
            return;
        }

        if (this.contentType === 'static' && status !== 'loaded') {
            throw new Error(`CompMessage: contentStatus can only be 'loaded' when contentType is 'static'!`);
        }

        if (this.contentType === 'stream' && status === 'loading') {
            throw new Error(`CompMessage: contentStatus cannot be 'loading' when contentType is 'stream'!`);
        }

        this.contentStatus = status;
        this.setProp('loadingStatus', status);
    }
}
