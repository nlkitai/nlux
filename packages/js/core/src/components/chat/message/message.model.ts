import {BotPersona} from '@nlux/core';
import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {debug} from '../../../x/debug';
import {warn} from '../../../x/warn';
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

export type MessageContentStatusChangeListener = (status: MessageContentLoadingStatus) => void;

@Model('message', renderMessage, updateMessage)
export class CompMessage extends BaseComp<
    CompMessageProps, CompMessageElements, CompMessageEvents, CompMessageActions
> {
    private __content?: string;
    private contentStatus: MessageContentLoadingStatus;
    private contentStatusChangeListeners: Set<MessageContentStatusChangeListener> = new Set();
    private readonly contentType: MessageContentType;
    private domChangeListeners: Set<Function> = new Set();
    private resizeListeners: Set<Function> = new Set();

    constructor(context: NluxContext, props: CompMessageProps) {
        super(context, props);

        this.__content = props.content;
        this.contentType = props.contentType;
        this.contentStatus = props.loadingStatus;
    }

    public get content() {
        return this.__content;
    }

    public get direction() {
        return this.props?.direction;
    };

    /**
     * Called to append content to the message, when the content is provided via stream.
     * @param {string} content
     */
    public appendContent(content: string) {
        if (this.contentType !== 'stream') {
            throw new Error(`CompMessage: content can only be appended when contentType is 'stream'!`);
        }

        if (this.contentStatus !== 'streaming' && this.contentStatus !== 'connecting') {
            throw new Error(
                `CompMessage: Content can only be appended when contentStatus is 'streaming' or 'connecting'!`,
            );
        }

        if (this.contentStatus === 'connecting') {
            this.setContentLoadingStatus('streaming');
        }

        this.__content = this.content ? this.content + content : content;
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

        if (this.contentStatus !== 'streaming' && this.contentStatus !== 'connecting') {
            throw new Error(
                `CompMessage: content can only be committed when contentStatus is 'streaming' or 'connecting'!`,
            );
        }

        this.executeDomAction('commitContent');
        this.setContentLoadingStatus('loaded');
    }

    public destroy() {
        this.resizeListeners.clear();
        this.contentStatusChangeListeners.clear();
        super.destroy();
    }

    onContentStatusChange(listener: MessageContentStatusChangeListener) {
        this.contentStatusChangeListeners.add(listener);
    }

    onDomChange(listener: Function) {
        this.domChangeListeners.add(listener);
    }

    onResize(listener: Function) {
        this.resizeListeners.add(listener);
    }

    removeContentStatusChangeListener(listener: MessageContentStatusChangeListener) {
        this.contentStatusChangeListeners.delete(listener);
    }

    removeDomChangeListener(listener: Function) {
        this.domChangeListeners.delete(listener);
    }

    removeResizeListener(listener: Function) {
        this.resizeListeners.delete(listener);
    }

    /**
     * Called to set the content when the content is provided via promise.
     * It should be called when the promise is resolved.
     * @param {string} content
     */
    public setContent(content: string) {
        if (this.contentType !== 'promise') {
            throw new Error(`CompMessage: content can only be set when contentType is 'promise'!`);
        }

        if (this.contentStatus !== 'loading') {
            throw new Error(`CompMessage: content can only be set when contentStatus is 'loading'!`);
        }

        this.__content = content;
        this.setContentLoadingStatus('loaded');
        this.executeDomAction('appendContent', content);
    }

    public setErrored() {
        if (this.contentStatus === 'loaded' || this.contentStatus === 'loading-error') {
            throw new Error(`CompMessage: Content cannot be erred when it is already loaded or errored!`);
        }

        this.setContentLoadingStatus('loading-error');
    }

    public setPersona(botPersona: BotPersona | undefined) {
        if (!this.props) {
            throw new Error(`CompMessage: Cannot set bot persona before props are initialized!`);
        }

        this.executeDomAction('updatePersona', botPersona);
    }

    public setStreamingAnimationSpeed(speed: number) {
        this.setProp('streamingAnimationSpeed', speed);
    }

    @CompEventListener('copy-to-clipboard-triggered')
    private handleCompCopyToClipboardTriggered(event: ClipboardEvent) {
        event.preventDefault();
        if (this.__content) {
            debug(`Copying selected message to clipboard!`);
            navigator.clipboard.writeText(this.__content).catch(error => {
                warn('Failed to copy selected message to clipboard!');
                debug(error);
            });
        }
    }

    @CompEventListener('message-container-dom-changed')
    private handleDomChange() {
        this.domChangeListeners.forEach(listener => listener());
    }

    @CompEventListener('message-container-resized')
    private handleResize() {
        this.resizeListeners.forEach(listener => listener());
    }

    private setContentLoadingStatus(status: MessageContentLoadingStatus) {
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

        this.contentStatusChangeListeners.forEach(listener => listener(this.contentStatus));

        // Final status - clear all listeners.
        if (status === 'loaded' || status === 'loading-error') {
            this.contentStatusChangeListeners.clear();
        }
    }
}
