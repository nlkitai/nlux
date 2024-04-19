import {ChatSegmentItem} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {debug} from '../../../../../../shared/src/utils/debug';
import {uid} from '../../../../../../shared/src/utils/uid';
import {warnOnce} from '../../../../../../shared/src/utils/warn';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {comp} from '../../../exports/aiChat/comp/comp';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {HistoryPayloadSize} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {ControllerContext} from '../../../types/controllerContext';
import {CompList} from '../../miscellaneous/list/model';
import {messageInList, textMessage} from '../chat-room/utils/textMessage';
import {CompChatSegment} from '../chatSegment/chatSegment.model';
import {CompChatSegmentProps} from '../chatSegment/chatSegment.types';
import {CompMessage} from '../message/message.model';
import type {MessageContentType} from '../message/message.types';
import {renderConversation} from './conversation.render';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
    CompConversationScrollParams,
} from './conversation.types';
import {updateConversation} from './conversation.update';

@Model('conversation', renderConversation, updateConversation)
export class CompConversation<AiMsg> extends BaseComp<
    AiMsg, CompConversationProps<AiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
> {
    private readonly chatSegmentsById: Map<string, CompChatSegment<AiMsg>> = new Map();
    private readonly conversationContent: ChatItem<AiMsg>[] = [];
    private lastMessageId?: string;
    private lastMessageResizedListener?: Function;
    private messagesContainerRendered: boolean = false;
    private messagesList: CompList<CompMessage<AiMsg>> | undefined;
    private scrollWhenGeneratingUserOption: boolean;
    private scrollingStickToConversationEnd: boolean = true;

    constructor(context: ControllerContext<AiMsg>, props: CompConversationProps<AiMsg>) {
        super(context, props);
        this.addConversation();
        this.scrollWhenGeneratingUserOption = props.scrollWhenGenerating ?? true;
        this.conversationContent = props.messages?.map((message) => ({...message})) ?? [];
    }

    public addChatItem(segmentId: string, item: ChatSegmentItem<AiMsg>) {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (!chatSegment) {
            throw new Error(`CompConversation: chat segment with id "${segmentId}" not found`);
        }

        if (chatSegment.destroyed) {
            // This could happen when streaming messages are received after the chat segment is destroyed
            warnOnce(`CompConversation: chat segment with id "${segmentId}" is destroyed and cannot be used`);
            return;
        }

        chatSegment.addChatItem(item);
    }

    public addChatSegment() {
        this.throwIfDestroyed();

        const segmentId = uid();
        const newChatSegmentComp = comp(CompChatSegment<AiMsg>)
            .withContext(this.context)
            .withProps({
                uid: segmentId,
                status: 'active',
            } satisfies CompChatSegmentProps)
            .create();

        this.chatSegmentsById.set(segmentId, newChatSegmentComp);
        this.addSubComponent(segmentId, newChatSegmentComp, 'messagesContainer');
        return segmentId;
    };

    public addChunk(segmentId: string, chatItemId: string, chunk: string) {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (!chatSegment) {
            throw new Error(`CompConversation: chat segment with id "${segmentId}" not found`);
        }

        chatSegment.addChunk(chatItemId, chunk);
    }

    public addMessage(
        direction: 'in' | 'out',
        contentType: MessageContentType,
        createdAt: Date,
        content?: AiMsg | string,
    ): string {
        if (!this.messagesList || !this.props) {
            throw new Error(`CompConversation: messagesList is not initialized! Make sure you call ` +
                `addConversation() before calling addMessage()`);
        }

        //
        // Remove welcome persona message and show messages container
        //
        if (!this.messagesContainerRendered) {
            this.executeDomAction('removeWelcomeMessage');
            this.messagesContainerRendered = true;
        }

        //
        // Create new message to add
        //
        const trackResizeAndDomChange = this.props.scrollWhenGenerating;
        const {
            botPersona,
            userPersona,
            streamingAnimationSpeed,
        } = this.props;
        const message = textMessage(
            this.context,
            direction,
            trackResizeAndDomChange,
            streamingAnimationSpeed,
            contentType,
            content as string,
            createdAt,
            botPersona,
            userPersona,
        );

        //
        // Clean up last message resize listener
        //
        if (this.lastMessageId && this.lastMessageResizedListener) {
            const lastMessage = this.getMessageById(this.lastMessageId);
            if (lastMessage) {
                lastMessage.removeResizeListener(this.lastMessageResizedListener);
                lastMessage.removeDomChangeListener(this.lastMessageResizedListener);
            }

            this.lastMessageId = undefined;
            this.lastMessageResizedListener = undefined;
        }

        //
        // Add new message
        //
        this.messagesList.appendComponent(message, messageInList);
        this.executeDomAction('scrollToBottom');

        //
        // Listen to the new message resize event
        //
        this.lastMessageId = message.id;
        this.lastMessageResizedListener = this.createMessageResizedListener(message.id);
        if (this.lastMessageResizedListener) {
            message.onResize(this.lastMessageResizedListener);
            message.onDomChange(this.lastMessageResizedListener);
        }

        return message.id;
    }

    public completeChatSegment(segmentId: string) {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (!chatSegment) {
            throw new Error(`CompConversation: chat segment with id "${segmentId}" not found`);
        }

        if (chatSegment.destroyed) {
            // This could happen when streaming messages are received after the chat segment is destroyed
            debug(`CompConversation: chat segment with id "${segmentId}" is destroyed and cannot be used`);
            return;
        }

        chatSegment.complete();
    }

    public getConversationContentForAdapter(
        historyPayloadSize: HistoryPayloadSize = 'max',
    ): ChatItem<AiMsg>[] | undefined {
        if (typeof historyPayloadSize === 'number' && historyPayloadSize <= 0) {
            warnOnce(
                `Invalid value provided for 'historyPayloadSize' : "${historyPayloadSize}"! ` +
                `Value must be a positive integer or 'all'.`,
            );

            return undefined;
        }

        if (historyPayloadSize === 'none') {
            return undefined;
        }

        if (historyPayloadSize === 'max') {
            // We should return a new reference
            return [...this.conversationContent];
        }

        return this.conversationContent.slice(-historyPayloadSize);
    }

    public getMessageById(messageId: string): CompMessage<AiMsg> | undefined {
        return this.messagesList?.getComponentById(messageId);
    }

    public removeChatSegment(segmentId: string) {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (!chatSegment) {
            return;
        }

        this.removeSubComponent(segmentId);
        this.chatSegmentsById.delete(segmentId);
    }

    public removeMessage(messageId: string) {
        this.messagesList?.removeComponentById(messageId);
        if (!this.messagesList || this.messagesList.size === 0) {
            this.executeDomAction('resetWelcomeMessage');
            this.messagesContainerRendered = false;
        }
    }

    public setBotPersona(botPersona: BotPersona | undefined) {
        this.setProp('botPersona', botPersona);

        this.messagesList?.forEachComponent((message) => {
            if (message.direction === 'in') {
                message.setPersona(botPersona);
            }
        });
    }

    public setStreamingAnimationSpeed(speed: number) {
        this.setProp('streamingAnimationSpeed', speed);
        this.messagesList?.forEachComponent((message) => {
            message.setStreamingAnimationSpeed(speed);
        });
    }

    public setUserPersona(userPersona: UserPersona | undefined) {
        this.setProp('userPersona', userPersona);

        this.messagesList?.forEachComponent((message) => {
            if (message.direction === 'out') {
                message.setPersona(userPersona);
            }
        });
    }

    public toggleAutoScrollToStreamingMessage(autoScrollToStreamingMessage: boolean) {
        this.scrollWhenGeneratingUserOption = autoScrollToStreamingMessage;
    }

    public updateConversationContent(newItem: ChatItem<AiMsg>) {
        this.conversationContent.push(newItem);
    }

    private addConversation() {
        this.messagesList = comp(CompList<CompMessage<AiMsg>>).withContext(this.context).create();
        this.addSubComponent(
            this.messagesList.id, this.messagesList, 'messagesContainer',
        );

        const initialMessages = this.props?.messages!;
        if (initialMessages) {
            initialMessages
                .filter((message) => message.role !== 'system')
                .forEach((message) => {
                    this.addMessage(
                        message.role === 'ai' ? 'in' : 'out',
                        'static',
                        new Date(),
                        message.message,
                    );
                });
        }
    }

    private createMessageResizedListener(messageId: string) {
        const message = this.getMessageById(messageId);
        if (!message) {
            return;
        }

        return () => {
            if (!this.destroyed && this.scrollWhenGeneratingUserOption && this.scrollingStickToConversationEnd) {
                this.executeDomAction('scrollToBottom');
            }
        };
    }

    @CompEventListener('user-scrolled')
    private handleUserScrolled({scrolledToBottom, scrollDirection}: CompConversationScrollParams) {
        if (this.scrollingStickToConversationEnd) {
            // When the user is already at the bottom of the conversation, we stick to the bottom
            // and only unstick when the user scrolls up.
            if (scrollDirection === 'up') {
                this.scrollingStickToConversationEnd = false;
            }
        } else {
            // When the user is not at the bottom of the conversation, we only stick to the bottom
            // when the user scrolls down and reaches the bottom.
            if (scrollDirection === 'down' && scrolledToBottom) {
                this.scrollingStickToConversationEnd = true;
            }
        }
    }
}
