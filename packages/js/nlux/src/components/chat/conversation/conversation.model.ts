import {BaseComp} from '../../../core/comp/base';
import {comp} from '../../../core/comp/comp';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {CompList} from '../../miscellaneous/list/model';
import {messageInList, textMessage} from '../chat-room/utils/textMessage';
import {CompMessage} from '../message/message.model';
import type {MessageContentType} from '../message/message.types';
import {renderConversation} from './conversation.render';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';
import {updateConversation} from './conversation.update';

@Model('conversation', renderConversation, updateConversation)
export class CompConversation extends BaseComp<
    CompConversationProps, CompConversationElements, CompConversationEvents, CompConversationActions
> {
    private messagesBeingStreamed: Set<string> = new Set();
    private messagesBeingStreamedResizeListeners: Map<string, Function> = new Map();
    private messagesList: CompList<CompMessage> | undefined;

    private scrollWhenGeneratingUserOption: boolean;
    private scrollingStickToConversationEnd: boolean = true;

    constructor(context: NluxContext, props: CompConversationProps) {
        super(context, props);
        this.addConversation();
        this.scrollWhenGeneratingUserOption = props.scrollWhenGenerating ?? true;
    }

    public addMessage<Message = string>(
        direction: 'in' | 'out',
        contentType: MessageContentType,
        createdAt: Date,
        content?: Message,
    ): string {
        if (!this.messagesList) {
            throw new Error(`CompConversation: messagesList is not initialized! Make sure you call` +
                `addConversation() before calling addMessage()!`);
        }

        const message = textMessage(
            this.context,
            direction,
            contentType,
            content as string,
            createdAt,
        );

        this.messagesList.appendComponent(message, messageInList);
        message.scrollToMessage();

        return message.id;
    }

    public getMessageById(messageId: string): CompMessage | undefined {
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

    public markMessageAsStreaming(messageId: string) {
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

    public removeMessage(messageId: string) {
        this.markMessageAsNotStreaming(messageId);
        this.messagesList?.removeComponentById(messageId);
    }

    public toggleAutoScrollToStreamingMessage(autoScrollToStreamingMessage: boolean) {
        this.scrollWhenGeneratingUserOption = autoScrollToStreamingMessage;
    }

    private addConversation() {
        this.messagesList = comp(CompList<CompMessage>).withContext(this.context).create();
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
}
