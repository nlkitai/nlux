import {
    ChatSegment,
    ChatSegmentItem,
    ChatSegmentStatus,
} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {chatSegmentsToChatItems} from '../../../../../../shared/src/utils/chat/chatSegmentsToChatItems';
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
    private chatSegmentCompIdsByIndex: string[] = [];
    private chatSegmentComponentsById: Map<string, CompChatSegment<AiMsg>> = new Map();

    constructor(context: ControllerContext<AiMsg>, props: CompConversationProps<AiMsg>) {
        super(context, props);
        this.addChatSegment('complete', props.messages);
    }

    public addChatItem(segmentId: string, item: ChatSegmentItem<AiMsg>) {
        const chatSegment = this.chatSegmentComponentsById.get(segmentId);
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

    public addChatSegment(
        status: ChatSegmentStatus = 'active',
        initialConversation?: ChatItem<AiMsg>[],
    ) {
        this.throwIfDestroyed();

        const segmentId = uid();
        const newChatSegmentComp = comp(CompChatSegment<AiMsg>)
            .withContext(this.context)
            .withProps({
                uid: segmentId,
                status,
                markdownLinkTarget: this.props.markdownLinkTarget,
                showCodeBlockCopyButton: this.props.showCodeBlockCopyButton,
                skipStreamingAnimation: this.props.skipStreamingAnimation,
                syntaxHighlighter: this.props.syntaxHighlighter,
                streamingAnimationSpeed: this.props.streamingAnimationSpeed,
            } satisfies CompChatSegmentProps)
            .create();

        if (initialConversation) {
            for (const item of initialConversation) {
                if (item.role === 'ai') {
                    newChatSegmentComp.addChatItem({
                        uid: uid(),
                        participantRole: 'ai',
                        time: new Date(),
                        dataTransferMode: 'fetch',
                        status: 'complete',
                        content: item.message,
                    });
                } else {
                    if (item.role === 'user') {
                        newChatSegmentComp.addChatItem({
                            uid: uid(),
                            participantRole: 'user',
                            time: new Date(),
                            status: 'complete',
                            content: item.message,
                        });
                    } else {
                        // System messages will not be displayed in the chat
                    }
                }
            }
        }

        // Add the chat segment to the map and the index
        this.chatSegmentComponentsById.set(segmentId, newChatSegmentComp);
        this.chatSegmentCompIdsByIndex.push(segmentId);

        const segmentComponentId = newChatSegmentComp.id;
        this.addSubComponent(segmentComponentId, newChatSegmentComp, 'segmentsContainer');

        return segmentId;
    };

    public addChunk(segmentId: string, chatItemId: string, chunk: string) {
        const chatSegment = this.chatSegmentComponentsById.get(segmentId);
        if (!chatSegment) {
            throw new Error(`CompConversation: chat segment with id "${segmentId}" not found`);
        }

        chatSegment.addChunk(chatItemId, chunk);
    }

    public completeChatSegment(segmentId: string) {
        const chatSegment = this.chatSegmentComponentsById.get(segmentId);
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
        const chatSegment = this.chatSegmentComponentsById.get(segmentId);
        if (chatSegment?.root instanceof HTMLElement) {
            return chatSegment.root;
        }
    }

    public getConversationContentForAdapter(
        historyPayloadSize: HistoryPayloadSize = 'max',
    ): ChatItem<AiMsg>[] | undefined {
        if (typeof historyPayloadSize === 'number' && historyPayloadSize < 0) {
            warnOnce(
                `Invalid value provided for 'historyPayloadSize' : "${historyPayloadSize}"! ` +
                `Value must be a positive integer or 'max'.`,
            );

            return undefined;
        }

        if (historyPayloadSize === 0) {
            return undefined;
        }

        const allSegmentsSorted: ChatSegment<AiMsg>[] = this.chatSegmentCompIdsByIndex.map(
            (segmentId) => this.chatSegmentComponentsById.get(segmentId),
        ).filter(
            item => item !== undefined,
        ).map(
            (item) => {
                return {
                    uid: item!.id,
                    status: 'complete',
                    items: item!.getChatItems().map(
                        compChatItem => compChatItem.getChatSegmentItem(),
                    ),
                } satisfies ChatSegment<AiMsg>;
            },
        ) as any; // Filter out undefined values

        const allChatItems = chatSegmentsToChatItems(allSegmentsSorted);

        if (historyPayloadSize === 'max') {
            return allChatItems;
        }

        return allChatItems.slice(-historyPayloadSize);
    }

    public removeChatSegment(segmentId: string) {
        const chatSegment = this.chatSegmentComponentsById.get(segmentId);
        if (!chatSegment) {
            return;
        }

        const segmentCompId = chatSegment.id;
        if (this.subComponents.has(segmentCompId)) {
            this.removeSubComponent(segmentCompId);
        }

        // Remove the chat segment from the map and the index
        this.chatSegmentComponentsById.delete(chatSegment.id);
        const index = this.chatSegmentCompIdsByIndex.indexOf(segmentId);
        if (index >= 0) {
            this.chatSegmentCompIdsByIndex.splice(index, 1);
        }
    }

    public setBotPersona(botPersona: BotPersona | undefined) {
        this.setProp('botPersona', botPersona);
    }

    public setUserPersona(userPersona: UserPersona | undefined) {
        this.setProp('userPersona', userPersona);
    }

    public updateMarkdownStreamRenderer(
        newProp: keyof CompConversationProps<AiMsg>,
        newValue: CompConversationProps<AiMsg>[typeof newProp],
    ) {
        this.setProp(newProp, newValue);
    }

    protected setProp<K extends keyof CompConversationProps<AiMsg>>(key: K, value: CompConversationProps<AiMsg>[K]) {
        super.setProp(key, value);

        if (
            key === 'markdownLinkTarget' || key === 'syntaxHighlighter' ||
            key === 'skipStreamingAnimation' || key === 'streamingAnimationSpeed' ||
            key === 'showCodeBlockCopyButton'
        ) {
            const typedKey = key satisfies keyof CompChatSegmentProps;
            const typedValue = value as CompChatSegmentProps[typeof typedKey];
            this.chatSegmentComponentsById.forEach((comp) => {
                comp.updateMarkdownStreamRenderer(typedKey, typedValue);
            });
        }
    }
}
