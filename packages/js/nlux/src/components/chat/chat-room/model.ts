import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {NluxContext} from '../../../types/context';
import {CompConversation} from '../conversation/model.ts';
import {CompChatbox} from '../prompt-box/model';
import {CompTextMessage} from '../text-message/model';
import {renderChatRoom} from './render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './types';
import {updateChatRoom} from './update';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom extends BaseComp<CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions> {

    private context: NluxContext;
    private conversation: CompConversation;
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

    private handlePromptBoxSubmit() {
        if (!this.promptBoxInstance) {
            return;
        }

        const {promptBoxInstance} = this;
        promptBoxInstance.enableTextInput(false);

        const messageToSent = this.promptBoxText;
        this.conversation.addMessage('out', messageToSent, new Date());

        const observable = this.context.adapter.send(messageToSent);
        const messageRef: {current: CompTextMessage | undefined} = {
            current: undefined,
        };

        observable.subscribe({
            next: (messageReceived) => {
                if (!messageReceived) {
                    return;
                }

                if (!messageRef.current) {
                    const messageId = this.conversation.addMessage('in', messageReceived, new Date());
                    messageRef.current = this.conversation.getMessageById(messageId) as any;
                    this.conversation.markMessageAsStreaming(messageId);
                } else {
                    messageRef.current.appendText(messageReceived);
                }
            },
            error: (error) => {
                promptBoxInstance.enableTextInput(true);
                promptBoxInstance.focusTextInput();

                if (messageRef.current) {
                    this.conversation.markMessageAsNotStreaming(messageRef.current.id);
                    messageRef.current = undefined;
                }
            },
            complete: () => {
                promptBoxInstance.enableTextInput(true);
                promptBoxInstance.resetTextInput();
                promptBoxInstance.focusTextInput();

                if (messageRef.current) {
                    this.conversation.markMessageAsNotStreaming(messageRef.current.id);
                    messageRef.current = undefined;
                }
            },
        });
    }

    private handlePromptBoxTextChange(newValue: string) {
        this.promptBoxText = newValue;
    }
}
