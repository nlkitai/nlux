import {Observable} from '../../../core/bus/observable';
import {BaseComp} from '../../../core/comp/base';
import {comp} from '../../../core/comp/comp';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {Message} from '../../../types/message';
import {CompConversation} from '../conversation/model';
import {CompConversationProps} from '../conversation/types';
import {CompPromptBox} from '../prompt-box/model';
import {CompTextMessage} from '../text-message/model';
import type {TextMessageContentLoadingStatus} from '../text-message/types';
import {renderChatRoom} from './render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './types';
import {updateChatRoom} from './update';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom extends BaseComp<
    CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
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

        if (contentStatus === 'loaded' || contentStatus === 'loading-error') {
            this.messagesInLoadingState.delete(messageId);
            this.messagesInStreamingState.delete(messageId);
        }
    };

    private messagesInLoadingState: Set<string> = new Set();
    private messagesInStreamingState: Set<string> = new Set();
    private promptBoxInstance: CompPromptBox;
    private promptBoxText: string = '';

    constructor(context: NluxContext, {
        containerMaxWidth,
        containerMaxHeight,
        scrollWhenGenerating,
        visible = true,
        promptBox,
    }: CompChatRoomProps) {
        super(context, {visible, containerMaxWidth, containerMaxHeight, scrollWhenGenerating});

        this.addConversation(scrollWhenGenerating);
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
            this.setProp('containerMaxHeight', props.containerMaxHeight ?? undefined);
        }

        if (props.hasOwnProperty('containerMaxWidth')) {
            this.setProp('containerMaxWidth', props.containerMaxWidth ?? undefined);
        }

        if (props.hasOwnProperty('scrollWhenGenerating')) {
            this.conversation?.toggleAutoScrollToStreamingMessage(props.scrollWhenGenerating ?? true);
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

    private addConversation(scrollWhenGenerating?: boolean) {
        this.conversation = comp(CompConversation)
            .withContext(this.context)
            .withProps<CompConversationProps>({
                scrollWhenGenerating,
            })
            .create();

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
        this.promptBoxInstance = comp(CompPromptBox).withContext(this.context).withProps({
            props: {
                enableTextInput: true,
                sendButtonStatus: 'disabled',
                textInputValue: '',
                placeholder,
                autoFocus,
            },
            eventListeners: {
                onTextUpdated: (newValue: string) => this.handlePromptBoxTextChange(newValue),
                onSubmit: () => this.handlePromptBoxSubmit(),
            },
        }).create();

        this.addSubComponent(this.promptBoxInstance.id, this.promptBoxInstance, 'promptBoxContainer');
    }

    private handleMessageStatusUpdatedFactory() {
        return (messageId: string, status: 'loading' | 'streaming' | 'loaded' | 'loading-error') => {
            this.handleMessageContentStatus(messageId, status);
        };
    }

    private handlePromptBoxSubmit() {
        if (!this.promptBoxInstance) {
            return;
        }

        const {promptBoxInstance} = this;
        promptBoxInstance.enableTextInput(false);
        promptBoxInstance.setSendButtonStatus('loading');

        const messageToSend = this.promptBoxText;
        const outMessageId = this.conversation.addMessage('out', messageToSend, new Date());

        const outMessageContentLoader: 'promise' | 'observable' = 'observable';
        const messageContentLoader: Observable<Message> | Promise<Message> =
            this.context.adapter.send(messageToSend);

        const messageId = this.conversation.addMessage(
            'in',
            messageContentLoader,
            new Date(),
            this.handleMessageStatusUpdatedFactory(),
        );

        if (messageContentLoader instanceof Promise) {
            this.listenToContentGenerationPromise(
                messageContentLoader,
                outMessageId,
                messageId,
            );
        } else {
            this.listenToContentGenerationObservable(
                messageContentLoader,
                outMessageId,
                messageId,
            );
        }

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

    private listenToContentGenerationObservable(
        observable: Observable<Message>,
        outMessageId: string,
        inMessageId: string,
    ) {
        observable.subscribe({
            next: () => {
                // Do nothing
            },
            complete: () => {
                if (!this.promptBoxInstance) {
                    return;
                }

                this.resetPromptBox(true);
            },
            error: () => {
                this.conversation.removeMessage(outMessageId);
                this.conversation.removeMessage(inMessageId);
                this.resetPromptBox();
            },
        });
    }

    private listenToContentGenerationPromise(
        promise: Promise<Message>,
        outMessageId: string,
        inMessageId: string,
    ) {
        promise.then(() => {
            if (!this.promptBoxInstance) {
                return;
            }

            this.resetPromptBox(true);
        }).catch((error: any) => {
            this.conversation.removeMessage(outMessageId);
            this.conversation.removeMessage(inMessageId);
            this.resetPromptBox();
        });
    }

    private resetPromptBox(resetTextInput: boolean = false) {
        if (!this.promptBoxInstance) {
            return;
        }

        this.promptBoxInstance.enableTextInput(true);
        if (resetTextInput) {
            this.promptBoxInstance.resetTextInput();
        }

        this.promptBoxInstance.resetSendButtonStatus();
        this.promptBoxInstance.focusTextInput();
    }
}
