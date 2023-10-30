import {Observable} from '../../../core/bus/observable.ts';
import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {CompConversation} from '../conversation/model.ts';
import {CompChatbox} from '../prompt-box/model';
import {CompTextMessage} from '../text-message/model';
import type {TextMessageContentLoadingStatus} from '../text-message/types.ts';
import {renderChatRoom} from './render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './types';
import {updateChatRoom} from './update';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom extends BaseComp<CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions> {

    private context: NluxContext;
    private conversation: CompConversation;

    private handleMessageContentStatus = (messageId: string, contentStatus: TextMessageContentLoadingStatus) => {
        if (contentStatus === 'loading') {
            this.messagesInLoadingState.add(messageId);
        } else {
            this.messagesInLoadingState.delete(messageId);
        }

        if (contentStatus === 'streaming') {
            this.messagesInStreamingState.add(messageId);
        } else {
            this.messagesInStreamingState.delete(messageId);
        }

        if (contentStatus === 'loaded' || contentStatus === 'error') {
            this.messagesInLoadingState.delete(messageId);
            this.messagesInStreamingState.delete(messageId);

            if (this.promptBoxInstance) {
                this.promptBoxInstance.enableTextInput(true);
                this.promptBoxInstance.focusTextInput();

                if (contentStatus === 'loaded') {
                    this.promptBoxInstance.resetTextInput();
                }
            }
        }
    };

    private messagesInLoadingState: Set<string> = new Set();
    private messagesInStreamingState: Set<string> = new Set();
    private promptBoxInstance: CompChatbox;
    private promptBoxText: string = '';

    constructor(instanceId: string, context: NluxContext, {
        containerMaxHeight,
        visible = true,
        promptBox,
    }: CompChatRoomProps) {
        super(instanceId, {visible, containerMaxHeight});

        this.context = context;

        this.addConversation();
        this.addPromptBox(promptBox?.placeholder, promptBox?.autoFocus);

        // @ts-ignore
        if (!this.conversation || !this.promptBoxInstance) {
            throw new Error('Conversation is not initialized');
        }
    }

    public hide() {
        this.setProp('visible', false);
    }

    @CompEventListener('messages-container-clicked')
    messagesContainerClicked() {
        this.promptBoxInstance?.focusTextInput();
    }

    public setProps(props: Partial<CompChatRoomProps>) {
        if (props.hasOwnProperty('containerMaxHeight')) {
            this.setProp('containerMaxHeight', props.containerMaxHeight ?? null);
        }
    }

    public show() {
        this.setProp('visible', true);
    }

    @CompEventListener('show-chat-room-clicked')
    showChatRoom(event: MouseEvent) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        if (event.preventDefault) {
            event.preventDefault();
        }

        this.setProp('visible', true);
        this.promptBoxInstance?.focusTextInput();
    }

    private addConversation() {
        this.conversation = new CompConversation(
            'main-conversation',
            {},
        );

        this.addSubComponent(
            this.conversation.id,
            this.conversation,
            'conversationContainer',
        );
    }

    private addPromptBox(
        placeholder?: string,
        autoFocus?: boolean,
    ) {
        this.promptBoxInstance = new CompChatbox(
            'main-prompt-box',
            {
                enableTextInput: true,
                enableSendButton: false,
                textInputValue: '',
                placeholder,
                autoFocus,
            },
            {
                onTextUpdated: (newValue: string) => this.handlePromptBoxTextChange(newValue),
                onSubmit: () => this.handlePromptBoxSubmit(),
            },
        );

        this.addSubComponent(this.promptBoxInstance.id, this.promptBoxInstance, 'promptBoxContainer');
    }

    private handleMessageStatusUpdatedFactory() {
        return (messageId: string, status: 'loading' | 'streaming' | 'loaded' | 'error') => {
            this.handleMessageContentStatus(messageId, status);
        };
    }

    private handlePromptBoxSubmit() {
        if (!this.promptBoxInstance) {
            return;
        }

        const {promptBoxInstance} = this;
        promptBoxInstance.enableTextInput(false);

        const messageToSent = this.promptBoxText;
        this.conversation.addMessage('out', messageToSent, new Date());

        const outMessageContentLoader: 'promise' | 'observable' = 'observable';
        const messageContentLoader: Observable<string> | Promise<string> = this.context.adapter.send(messageToSent);

        const messageId = this.conversation.addMessage(
            'in',
            messageContentLoader,
            new Date(),
            this.handleMessageStatusUpdatedFactory(),
        );

        const message: CompTextMessage | undefined = this.conversation.getMessageById(messageId) as any;
        if (!message) {
            return;
        }

        if (!message.contentLoaded) {
            if (outMessageContentLoader === 'observable') {
                this.messagesInStreamingState.add(messageId);
            } else {
                this.messagesInLoadingState.add(messageId);
            }
        }
    }

    private handlePromptBoxTextChange(newValue: string) {
        this.promptBoxText = newValue;
    }
}
