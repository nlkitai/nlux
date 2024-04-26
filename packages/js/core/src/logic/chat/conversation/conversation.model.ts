import {MarkdownStreamParserConfigOption} from '@nlux-dev/markdown/src';
import {ChatSegmentItem} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {debug} from '../../../../../../shared/src/utils/debug';
import {uid} from '../../../../../../shared/src/utils/uid';
import {warnOnce} from '../../../../../../shared/src/utils/warn';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {comp} from '../../../exports/aiChat/comp/comp';
import {Model} from '../../../exports/aiChat/comp/decorators';
import {HistoryPayloadSize} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {ControllerContext} from '../../../types/controllerContext';
import {CompChatSegment} from '../chatSegment/chatSegment.model';
import {CompChatSegmentProps} from '../chatSegment/chatSegment.types';
import {renderConversation} from './conversation.render';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';
import {updateConversation} from './conversation.update';

@Model('conversation', renderConversation, updateConversation)
export class CompConversation<AiMsg> extends BaseComp<
    AiMsg, CompConversationProps<AiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
> {
    private readonly chatSegmentsById: Map<string, CompChatSegment<AiMsg>> = new Map();
    private readonly conversationContent: ChatItem<AiMsg>[] = [];

    constructor(context: ControllerContext<AiMsg>, props: CompConversationProps<AiMsg>) {
        super(context, props);
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
                openLinksInNewWindow: this.props.openLinksInNewWindow,
                skipAnimation: this.props.skipAnimation,
                syntaxHighlighter: this.props.syntaxHighlighter,
                streamingAnimationSpeed: this.props.streamingAnimationSpeed,
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

    public getChatSegmentContainer(segmentId: string): HTMLElement | undefined {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (chatSegment?.root instanceof HTMLElement) {
            return chatSegment.root;
        }
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

    public removeChatSegment(segmentId: string) {
        const chatSegment = this.chatSegmentsById.get(segmentId);
        if (!chatSegment) {
            return;
        }

        if (this.subComponents.has(segmentId)) {
            this.removeSubComponent(segmentId);
        }

        this.chatSegmentsById.delete(segmentId);
    }

    public setBotPersona(botPersona: BotPersona | undefined) {
        this.setProp('botPersona', botPersona);
    }

    public setUserPersona(userPersona: UserPersona | undefined) {
        this.setProp('userPersona', userPersona);
    }

    public updateMarkdownStreamRenderer(
        newProp: MarkdownStreamParserConfigOption,
        newValue: CompConversationProps<AiMsg>[MarkdownStreamParserConfigOption],
    ) {
        this.setProp(newProp, newValue);
    }

    protected setProp<K extends keyof CompConversationProps<AiMsg>>(key: K, value: CompConversationProps<AiMsg>[K]) {
        super.setProp(key, value);

        if (
            key === 'openLinksInNewWindow' || key === 'syntaxHighlighter' ||
            key === 'skipAnimation' || key === 'streamingAnimationSpeed'
        ) {
            const updateKey = key as MarkdownStreamParserConfigOption;
            const updateValue = value as CompConversationProps<AiMsg>[MarkdownStreamParserConfigOption];
            this.chatSegmentsById.forEach((comp) => {
                comp.updateMarkdownStreamRenderer(updateKey, updateValue);
            });
        }
    }
}
