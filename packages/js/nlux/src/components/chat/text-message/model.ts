import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {debug} from '../../../x/debug';
import {renderTextMessage} from './render';
import {CompTextMessageActions, CompTextMessageElements, CompTextMessageEvents, CompTextMessageProps} from './types';
import {updateTextMessage} from './update';

@Model('text-message', renderTextMessage, updateTextMessage)
export class CompTextMessage extends BaseComp<
    CompTextMessageProps, CompTextMessageElements, CompTextMessageEvents, CompTextMessageActions
> {
    scrollToMessageEndOnResize = () => {
        if (this.shouldKeepVisibleWhenGeneratingContent) {
            this.executeDomAction('scrollToMessageEndContainer');
        }
    };

    private contentAppended: string;
    private resizeListeners: Set<Function> = new Set();
    private shouldKeepVisibleWhenGeneratingContent: boolean = false;

    constructor(instanceId: string, props: CompTextMessageProps) {
        super(instanceId, props);
        this.contentAppended = props.initialContent;
    }

    public appendText(text: string) {
        this.executeDomAction('appendText', text);
        this.contentAppended += text;
    }

    public destroy() {
        this.resizeListeners.clear();
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

    @CompEventListener('copy-to-clipboard-triggered')
    private handleCompCopyToClipboardTriggered(event: ClipboardEvent) {
        event.preventDefault();
        debug(`Copying selected message to clipboard!`);
        navigator.clipboard.writeText(this.contentAppended);
    }

    @CompEventListener('message-container-resized')
    private handleResize() {
        this.resizeListeners.forEach(listener => listener());
    }
}
