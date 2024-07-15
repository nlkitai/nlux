import {ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '@shared/types/chatSegment/chatSegmentAiMessage';
import {ChatSegmentUserMessage} from '@shared/types/chatSegment/chatSegmentUserMessage';
import {ChatItemProps} from '@shared/components/ChatItem/props';
import {BaseComp} from '../../../aiChat/comp/base';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ControllerContext} from '../../../types/controllerContext';
import {renderChatItem} from './chatItem.render';
import {CompChatItemActions, CompChatItemElements, CompChatItemEvents, CompChatItemProps} from './chatItem.types';
import {updateChatItem} from './chatItem.update';

@Model('chatItem', renderChatItem, updateChatItem)
export class CompChatItem<AiMsg> extends BaseComp<
    AiMsg, CompChatItemProps, CompChatItemElements, CompChatItemEvents, CompChatItemActions
> {
    private aiMessageContent: AiMsg | undefined;
    private serverResponse: Array<string | object | undefined> = [];
    private stringContent: string = '';

    constructor(
        context: ControllerContext<AiMsg>,
        props: CompChatItemProps,
    ) {
        super(context, props);
        if (props.domProps.message !== undefined) {
            this.stringContent = props.domProps.message;
        }
    }

    public addChunk(chunk: AiMsg, serverResponse?: string | object) {
        this.throwIfDestroyed();
        this.executeDomAction('processStreamedChunk', chunk);

        if (typeof chunk === 'string') {
            this.stringContent += chunk;
        }

        this.serverResponse.push(serverResponse);
    }

    public commitChunks() {
        this.throwIfDestroyed();
        this.executeDomAction('commitStreamedChunks');
    }

    public getChatSegmentItem(): ChatSegmentItem<AiMsg> {
        const domProps = this.getProp('domProps') as ChatItemProps;
        if (domProps.direction === 'received') {
            return {
                uid: this.props.uid,
                participantRole: 'assistant',
                content: this.getItemContent() as AiMsg,
                contentType: 'text',
                serverResponse: this.serverResponse,
                status: 'complete',
                dataTransferMode: 'batch',
                time: new Date(),
            } satisfies ChatSegmentAiMessage<AiMsg>;
        }

        return {
            uid: this.props.uid,
            participantRole: 'user',
            content: this.getItemContent() as string,
            contentType: 'text',
            status: 'complete',
            time: new Date(),
        } satisfies ChatSegmentUserMessage;
    }

    public getItemContent(): AiMsg | string {
        return this.aiMessageContent ?? this.stringContent;
    }

    public updateDomProps(updatedProps: Partial<ChatItemProps>) {
        const oldProps: ChatItemProps = this.getProp('domProps') as ChatItemProps;
        const newProps: ChatItemProps = {
            ...oldProps,
            ...updatedProps,
        };

        this.setProp('domProps', newProps);
        this.executeDomAction('updateDomProps', oldProps, newProps);
    }

    public updateMarkdownStreamRenderer(
        newProp: keyof CompChatItemProps,
        newValue: CompChatItemProps[typeof newProp],
    ) {
        this.setProp(newProp, newValue);

        if (newProp === 'syntaxHighlighter') {
            const typedNewValue = newValue as HighlighterExtension | undefined;
            this.executeDomAction('updateMarkdownStreamRenderer', {
                syntaxHighlighter: typedNewValue,
            } satisfies Partial<CompChatItemProps>);
        }

        if (newProp === 'htmlSanitizer') {
            const typedNewValue = newValue as ((html: string) => string) | undefined;
            this.executeDomAction('updateMarkdownStreamRenderer', {
                htmlSanitizer: typedNewValue,
            } satisfies Partial<CompChatItemProps>);
        }
    }

    @CompEventListener('markdown-stream-complete')
    private onMarkdownStreamComplete(messageRendered: AiMsg) {
        this.context.emit('messageRendered', { uid: this.props.uid });
    }
}
