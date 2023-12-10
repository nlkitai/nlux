import {BaseComp} from '../../../core/comp/base';
import {comp} from '../../../core/comp/comp';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {CompList} from '../../miscellaneous/list/model';
import {messageInList, textMessage} from '../chat-room/utils/textMessage';
import {CompMessage} from '../message/message.model';
import {MessageContentLoadingStatus} from '../message/message.types';
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
    private lastMessageId?: string;
    private lastMessageResizedListener?: Function;
    private messagesList: CompList<CompMessage> | undefined;

    private scrollWhenGeneratingUserOption: boolean;
    private scrollingStickToConversationEnd: boolean = true;

    constructor(context: NluxContext, props: CompConversationProps) {
        super(context, props);
        this.addConversation();
        this.scrollWhenGeneratingUserOption = props.scrollWhenGenerating ?? true;
    }

    public addMessage(
        direction: 'in' | 'out',
        contentType: MessageContentType,
        createdAt: Date,
        content?: string,
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

        // Clean up last message resize listener
        if (this.lastMessageId && this.lastMessageResizedListener) {
            const lastMessage = this.getMessageById(this.lastMessageId);
            if (lastMessage) {
                lastMessage.removeResizeListener(this.lastMessageResizedListener);
            }

            this.lastMessageId = undefined;
            this.lastMessageResizedListener = undefined;
        }

        // Add new message
        this.messagesList.appendComponent(message, messageInList);
        this.executeDomAction('scrollToBottom');

        // Listen to the new message resize event
        this.lastMessageId = message.id;
        this.lastMessageResizedListener = this.createMessageResizedListener(message.id);
        if (this.lastMessageResizedListener) {
            message.onResize(this.lastMessageResizedListener);
        }

        return message.id;
    }

    public getMessageById(messageId: string): CompMessage | undefined {
        return this.messagesList?.getComponentById(messageId);
    }

    public removeMessage(messageId: string) {
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
            if (this.scrollWhenGeneratingUserOption && this.scrollingStickToConversationEnd) {
                this.executeDomAction('scrollToBottom');
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
