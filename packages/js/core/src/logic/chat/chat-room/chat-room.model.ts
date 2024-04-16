import {PromptBoxProps} from '../../../../../../shared/src/ui/PromptBox/props';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {comp} from '../../../exports/aiChat/comp/comp';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {HistoryPayloadSize} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {isStandardChatAdapter, StandardChatAdapter} from '../../../types/adapters/chat/standardChatAdapter';
import {ControllerContext} from '../../../types/controllerContext';
import {ChatItem} from '../../../types/conversation';
import {CompConversation} from '../conversation/conversation.model';
import {CompConversationProps} from '../conversation/conversation.types';
import {CompPromptBox} from '../prompt-box/prompt-box.model';
import {CompPromptBoxProps} from '../prompt-box/prompt-box.types';
import {submitPromptFactory} from './actions/submitPrompt';
import {renderChatRoom} from './chat-room.render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chat-room.types';
import {updateChatRoom} from './chat-room.update';
import {getStreamingAnimationSpeed} from './utils/streamingAnimationSpeed';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom<AiMsg> extends BaseComp<
    AiMsg, CompChatRoomProps, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
    // Set scroll when generating default value to true, when not specified
    static defaultScrollWhenGeneratingUserOption = true;

    private conversation: CompConversation<AiMsg>;
    private promptBoxInstance: CompPromptBox<AiMsg>;
    private promptBoxText: string = '';

    constructor(context: ControllerContext<AiMsg>, {
        scrollWhenGenerating,
        streamingAnimationSpeed,
        visible = true,
        promptBox,
        botPersona,
        userPersona,
        initialConversationContent,
    }: CompChatRoomProps) {
        super(context, {
            visible,
            scrollWhenGenerating,
            streamingAnimationSpeed,
            botPersona,
            userPersona,
            promptBox,
        });

        const scrollWhenGeneratingUserOption = scrollWhenGenerating
            ?? CompChatRoom.defaultScrollWhenGeneratingUserOption;

        this.addConversation(
            scrollWhenGeneratingUserOption,
            getStreamingAnimationSpeed(streamingAnimationSpeed),
            botPersona,
            userPersona,
            initialConversationContent,
        );

        this.addPromptBox(
            promptBox?.placeholder,
            promptBox?.autoFocus,
            promptBox?.disableSubmitButton,
            promptBox?.submitShortcut,
        );

        // @ts-ignore
        if (!this.conversation || !this.promptBoxInstance) {
            throw new Error('Conversation is not initialized');
        }
    }

    public getConversationContentForAdapter(historyPayloadSize: HistoryPayloadSize = 'max') {
        return this.conversation.getConversationContentForAdapter(historyPayloadSize);
    }

    public hide() {
        this.setProp('visible', false);
    }

    @CompEventListener('messages-container-clicked')
    messagesContainerClicked() {
        this.promptBoxInstance?.focusTextInput();
    }

    @CompEventListener('chat-room-ready')
    onChatRoomReady() {
        this.context.emit('ready', {
            aiChatProps: this.context.aiChatProps,
        });
    }

    public setProps(props: Partial<CompChatRoomProps>) {
        if (props.hasOwnProperty('scrollWhenGenerating')) {
            this.conversation?.toggleAutoScrollToStreamingMessage(props.scrollWhenGenerating ?? true);
        }

        if (props.hasOwnProperty('streamingAnimationSpeed')) {
            this.conversation?.setStreamingAnimationSpeed(
                getStreamingAnimationSpeed(props.streamingAnimationSpeed),
            );
        }

        if (props.hasOwnProperty('botPersona')) {
            this.conversation?.setBotPersona(props.botPersona ?? undefined);
        }

        if (props.hasOwnProperty('userPersona')) {
            this.conversation?.setUserPersona(props.userPersona ?? undefined);
        }

        if (props.hasOwnProperty('promptBox')) {
            if (this.promptBoxInstance) {
                const currentDomProps = this.promptBoxInstance.getProp('domCompProps')!;
                const newProps: PromptBoxProps = {
                    ...currentDomProps,
                    ...props.promptBox,
                };

                this.promptBoxInstance.setDomProps(newProps);
            }
        }
    }

    public show() {
        this.setProp('visible', true);
    }

    private addConversation(
        scrollWhenGenerating: boolean,
        streamingAnimationSpeed: number,
        botPersona?: BotPersona,
        userPersona?: UserPersona,
        initialConversationContent?: readonly ChatItem[],
    ) {
        this.conversation = comp(CompConversation<AiMsg>)
            .withContext(this.context)
            .withProps<CompConversationProps>({
                scrollWhenGenerating,
                streamingAnimationSpeed,
                botPersona,
                userPersona,
                messages: initialConversationContent,
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
        disableSubmitButton?: boolean,
        submitShortcut?: 'Enter' | 'CommandEnter',
    ) {
        this.promptBoxInstance = comp(CompPromptBox<AiMsg>).withContext(this.context).withProps({
            props: {
                domCompProps: {
                    status: 'typing',
                    placeholder,
                    autoFocus,
                    disableSubmitButton,
                    submitShortcut,
                },
            } satisfies CompPromptBoxProps,
            eventListeners: {
                onTextUpdated: (newValue: string) => this.handlePromptBoxTextChange(newValue),
                onSubmit: () => this.handlePromptBoxSubmit(),
            },
        }).create();

        this.addSubComponent(this.promptBoxInstance.id, this.promptBoxInstance, 'promptBoxContainer');
    }

    private handlePromptBoxSubmit() {
        const {adapter} = this.context;
        const adapterAsStandardAdapter: StandardChatAdapter<AiMsg> | undefined = isStandardChatAdapter(
            adapter as any) ?
            adapter as any : undefined;

        const promptBoxProps: Partial<PromptBoxProps> | undefined = this.props.promptBox;

        submitPromptFactory({
            dataTransferMode: adapterAsStandardAdapter ? adapterAsStandardAdapter.dataTransferMode : undefined,
            context: this.context,
            promptBoxInstance: this.promptBoxInstance,
            conversation: this.conversation,
            messageToSend: this.promptBoxText,
            resetPromptBox: (resetTextInput?: boolean) => this.resetPromptBox(
                resetTextInput,
                promptBoxProps?.autoFocus,
            ),
        })();
    }

    private handlePromptBoxTextChange(newValue: string) {
        this.promptBoxText = newValue;
    }

    private resetPromptBox(resetTextInput: boolean = false, focusOnReset: boolean = false) {
        if (!this.promptBoxInstance) {
            return;
        }

        const currentCompProps = this.promptBoxInstance.getProp('domCompProps') as PromptBoxProps;
        const newProps: PromptBoxProps = {
            ...currentCompProps,
            status: 'typing',
        };

        if (resetTextInput) {
            newProps.message = '';
        }

        this.promptBoxInstance.setDomProps(newProps);

        if (focusOnReset) {
            this.promptBoxInstance.focusTextInput();
        }
    }
}
