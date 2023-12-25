import {BaseComp} from '../../../core/comp/base';
import {comp} from '../../../core/comp/comp';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {BotPersona, UserPersona} from '../../../core/options/personaOptions';
import {NluxContext} from '../../../types/context';
import {isStandardAdapter, StandardAdapter} from '../../../types/standardAdapter';
import {CompConversation} from '../conversation/conversation.model';
import {CompConversationProps} from '../conversation/conversation.types';
import {CompPromptBox} from '../prompt-box/prompt-box.model';
import {submitPromptFactory} from './actions/submitPrompt';
import {renderChatRoom} from './chat-room.render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chat-room.types';
import {updateChatRoom} from './chat-room.update';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom extends BaseComp<
    CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
    private conversation: CompConversation;
    private promptBoxInstance: CompPromptBox;
    private promptBoxText: string = '';

    constructor(context: NluxContext, {
        containerMaxHeight,
        containerHeight,
        containerMaxWidth,
        containerWidth,
        scrollWhenGenerating,
        visible = true,
        promptBox,
        botPersona,
        userPersona,
    }: CompChatRoomProps) {
        super(context, {
            visible,
            containerMaxHeight,
            containerHeight,
            containerMaxWidth,
            containerWidth,
            scrollWhenGenerating,
            botPersona,
            userPersona,
        });

        // Set scroll when generating default value to true, when not specified
        const scrollWhenGeneratingUserOption = scrollWhenGenerating ?? true;

        this.addConversation(scrollWhenGeneratingUserOption, botPersona, userPersona);
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

        if (props.hasOwnProperty('containerHeight')) {
            this.setProp('containerHeight', props.containerHeight ?? undefined);
        }

        if (props.hasOwnProperty('containerMaxWidth')) {
            this.setProp('containerMaxWidth', props.containerMaxWidth ?? undefined);
        }

        if (props.hasOwnProperty('containerWidth')) {
            this.setProp('containerWidth', props.containerWidth ?? undefined);
        }

        if (props.hasOwnProperty('scrollWhenGenerating')) {
            this.conversation?.toggleAutoScrollToStreamingMessage(props.scrollWhenGenerating ?? true);
        }

        if (props.hasOwnProperty('botPersona')) {
            this.conversation?.setBotPersona(props.botPersona ?? undefined);
        }

        if (props.hasOwnProperty('userPersona')) {
            this.conversation?.setUserPersona(props.userPersona ?? undefined);
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

    private addConversation(
        scrollWhenGenerating: boolean,
        botPersona?: BotPersona,
        userPersona?: UserPersona,
    ) {
        this.conversation = comp(CompConversation)
            .withContext(this.context)
            .withProps<CompConversationProps>({
                scrollWhenGenerating,
                botPersona,
                userPersona,
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

    private handlePromptBoxSubmit() {
        const {adapter} = this.context;
        const adapterAsStandardAdapter: StandardAdapter<any, any> | undefined = isStandardAdapter(adapter as any) ?
            adapter as any : undefined;

        submitPromptFactory({
            dataTransferMode: adapterAsStandardAdapter ? adapterAsStandardAdapter.dataTransferMode : undefined,
            context: this.context,
            promptBoxInstance: this.promptBoxInstance,
            conversation: this.conversation,
            messageToSend: this.promptBoxText,
            resetPromptBox: (resetTextInput?: boolean) => this.resetPromptBox(resetTextInput),
        })();
    }

    private handlePromptBoxTextChange(newValue: string) {
        this.promptBoxText = newValue;
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
