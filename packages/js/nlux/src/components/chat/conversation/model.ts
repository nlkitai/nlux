import {Observable} from '../../../core/bus/observable';
import {BaseComp} from '../../../core/comp/base';
import {comp} from '../../../core/comp/comp';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {domOp} from '../../../x/domOp';
import {CompList} from '../../miscellaneous/list/model';
import {messageInList, textMessage} from '../chat-room/utils/textMessage';
import {CompTextMessage} from '../text-message/model';
import type {TextMessageContentLoadingStatus} from '../text-message/types';
import {renderConversation} from './render';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './types';
import {updateConversation} from './update';

@Model('conversation', renderConversation, updateConversation)
export class CompConversation extends BaseComp<
    CompConversationProps, CompConversationElements, CompConversationEvents, CompConversationActions
> {
    private handleMessageStatusUpdatedFactory = (onMessageStatusUpdated?: (messageId: string, status: TextMessageContentLoadingStatus) => void) => {
        return (messageId: string, status: TextMessageContentLoadingStatus) => {
            onMessageStatusUpdated?.(messageId, status);
            if (status === 'streaming' || status === 'loading') {
                domOp(() => {
                    this.markMessageAsStreaming(messageId);
                });
            }

            if (status === 'loaded' || status === 'loading-error') {
                domOp(() => {
                    this.markMessageAsNotStreaming(messageId);
                });

                if (status === 'loading-error') {
                    return;
                }
            }

            const message = this.getMessageById(messageId);
            if (status === 'loaded' && message && message.contentLoadingMode === 'promise') {
                message.scrollToMessage();
            }
        };
    };
    private messagesBeingStreamed: Set<string> = new Set();
    private messagesBeingStreamedResizeListeners: Map<string, Function> = new Map();
    private messagesList: CompList<CompTextMessage> | undefined;

    private scrollWhenGeneratingUserOption: boolean;
    private scrollingStickToConversationEnd: boolean = true;

    constructor(context: NluxContext, props: CompConversationProps) {
        super(context, props);
        this.addConversation();
        this.scrollWhenGeneratingUserOption = props.scrollWhenGenerating ?? true;
    }

    public addMessage<Message = string>(
        direction: 'in' | 'out',
        source: string | Promise<Message> | Observable<Message>,
        createdAt: Date,
        onMessageStatusUpdated?: (messageId: string, status: TextMessageContentLoadingStatus) => void,
    ): string {
        if (!this.messagesList) {
            throw new Error(`CompConversation: messagesList is not initialized! Make sure you call` +
                `addConversation() before calling addMessage()!`);
        }

        const handleMessageStatusUpdated = this.handleMessageStatusUpdatedFactory(onMessageStatusUpdated);
        const message = textMessage(
            this.context,
            direction,
            source as string | Promise<string> | Observable<string>, // TODO - Make more generic
            createdAt,
            handleMessageStatusUpdated,
        );

        this.messagesList.appendComponent(message, messageInList);
        message.scrollToMessage();

        return message.id;
    }

    public getMessageById(messageId: string): CompTextMessage | undefined {
        return this.messagesList?.getComponentById(messageId);
    }

    public markMessageAsNotStreaming(messageId: string) {
        const onResizeListener = this.messagesBeingStreamedResizeListeners.get(messageId);
        this.messagesBeingStreamed.delete(messageId);
        this.messagesBeingStreamedResizeListeners.delete(messageId);

        const message = this.getMessageById(messageId);
        if (!message || !onResizeListener) {
            return;
        }

        message.removeResizeListener(onResizeListener);
    }

    public removeMessage(messageId: string) {
        this.messagesList?.removeComponentById(messageId);
    }

    public toggleAutoScrollToStreamingMessage(autoScrollToStreamingMessage: boolean) {
        this.scrollWhenGeneratingUserOption = autoScrollToStreamingMessage;
    }

    private addConversation() {
        this.messagesList = comp(CompList<CompTextMessage>).withContext(this.context).create();
        this.addSubComponent(this.messagesList.id, this.messagesList, 'messagesContainer');
    }

    private createMessageResizedListener(messageId: string) {
        const message = this.getMessageById(messageId);
        if (!message) {
            return;
        }

        return () => {
            if (this.scrollWhenGeneratingUserOption &&
                this.scrollingStickToConversationEnd &&
                this.messagesBeingStreamed.size === 1 &&
                this.messagesBeingStreamed.has(messageId)
            ) {
                message.scrollToMessage();
            }
        };
    }

    @CompEventListener('user-scrolled')
    private handleUserScrolled({scrolledToBottom}: {
        scrolledToBottom: boolean
    }) {
        // Turn this flag to `true` when the user scrolls to the end of the conversation
        // Along with `scrollWhenGeneratingUserOption`, this flag is used to determine whether to scroll to the end
        // of the conversation when a new message is added or being generated.
        this.scrollingStickToConversationEnd = scrolledToBottom;
    }

    private markMessageAsStreaming(messageId: string) {
        const message = this.getMessageById(messageId);
        if (!message || this.messagesBeingStreamed.has(messageId)) {
            return;
        }

        this.messagesBeingStreamed.add(messageId);
        const messageResizedListener = this.createMessageResizedListener(messageId);
        if (messageResizedListener) {
            this.messagesBeingStreamedResizeListeners.set(messageId, messageResizedListener);
            message.onResize(messageResizedListener);

            // Max time to keep message marked as streaming is 2 minutes
            // If the message is not marked as not streaming after 2 minutes, it will be marked as not streaming
            // so that the conversation box does not keep scrolling to the end of the message forever.
            setTimeout(() => {
                this.markMessageAsNotStreaming(messageId);
            }, 120000);
        }
    }
}
