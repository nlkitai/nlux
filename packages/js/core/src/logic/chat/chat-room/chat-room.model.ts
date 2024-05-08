import {createAutoScrollController} from '../../../../../../shared/src/interactions/autoScroll/autoScrollController';
import {AutoScrollController} from '../../../../../../shared/src/interactions/autoScroll/type';
import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {PromptBoxProps} from '../../../../../../shared/src/ui/PromptBox/props';
import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {comp} from '../../../exports/aiChat/comp/comp';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {HistoryPayloadSize} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {ControllerContext} from '../../../types/controllerContext';
import {CompConversation} from '../conversation/conversation.model';
import {CompConversationProps} from '../conversation/conversation.types';
import {CompPromptBox} from '../prompt-box/prompt-box.model';
import {CompPromptBoxProps} from '../prompt-box/prompt-box.types';
import {submitPromptFactory} from './actions/submitPrompt';
import {renderChatRoom} from './chat-room.render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chat-room.types';
import {updateChatRoom} from './chat-room.update';

@Model('chat-room', renderChatRoom, updateChatRoom)
export class CompChatRoom<AiMsg> extends BaseComp<
    AiMsg, CompChatRoomProps<AiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
    private autoScrollController: AutoScrollController | undefined;
    private conversation: CompConversation<AiMsg>;
    private promptBoxInstance: CompPromptBox<AiMsg>;
    private promptBoxText: string = '';

    constructor(context: ControllerContext<AiMsg>, {
            autoScroll,
            streamingAnimationSpeed,
            visible = true,
            promptBox,
            botPersona,
            userPersona,
            initialConversationContent,
            syntaxHighlighter,
            skipStreamingAnimation,
            markdownLinkTarget,
        }: CompChatRoomProps<AiMsg>,
    ) {
        super(context, {
            visible,
            autoScroll,
            streamingAnimationSpeed,
            botPersona,
            userPersona,
            promptBox,
            syntaxHighlighter,
            markdownLinkTarget,
            skipStreamingAnimation,
        });

        this.addConversation(
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

    @CompEventListener('segments-container-clicked')
    messagesContainerClicked() {
        this.promptBoxInstance?.focusTextInput();
    }

    @CompEventListener('chat-room-ready')
    onChatRoomReady() {
        domOp(() => {
            const conversationContainer = this.renderedDom?.elements?.conversationContainer;
            if (conversationContainer instanceof HTMLElement) {
                this.autoScrollController = createAutoScrollController(
                    conversationContainer,
                    this.props.autoScroll ?? true,
                );

                // Attempt to scroll to the bottom of the conversation container on initial render.
                // Initially do it every 10ms for 200ms, then stop.
                let numberOfScrollToBottomAttempts = 0;
                const maxNumberOfScrollToBottomAttempts = 20;
                const attemptsInterval = 10;

                const attemptScrollToBottom = () => {
                    // Only scroll to the bottom if the conversation container is already rendered
                    if (conversationContainer.scrollHeight > conversationContainer.clientHeight) {
                        conversationContainer.scrollTo({behavior: 'smooth', top: 50000});
                        clearInterval(intervalId);
                    }
                };

                const intervalId = setInterval(() => {
                    if (numberOfScrollToBottomAttempts >= maxNumberOfScrollToBottomAttempts) {
                        clearInterval(intervalId);
                        return;
                    }

                    attemptScrollToBottom();
                    numberOfScrollToBottomAttempts++;
                }, attemptsInterval);
            }

            this.context.emit('ready', {
                aiChatProps: this.context.aiChatProps,
            });
        });
    }

    public setProps(props: Partial<CompChatRoomProps<AiMsg>>) {
        if (props.hasOwnProperty('autoScroll')) {
            const autoScroll = props.autoScroll!;
            this.autoScrollController?.updateProps({autoScroll});
        }

        if (props.hasOwnProperty('syntaxHighlighter')) {
            this.setProp('syntaxHighlighter', props.syntaxHighlighter!);
        }

        if (props.hasOwnProperty('markdownLinkTarget')) {
            this.setProp('markdownLinkTarget', props.markdownLinkTarget!);
        }

        if (props.hasOwnProperty('skipStreamingAnimation')) {
            this.setProp('skipStreamingAnimation', props.skipStreamingAnimation!);
        }

        if (props.hasOwnProperty('streamingAnimationSpeed')) {
            this.setProp('streamingAnimationSpeed', props.streamingAnimationSpeed!);
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

    protected setProp<K extends keyof CompChatRoomProps<AiMsg>>(key: K, value: CompChatRoomProps<AiMsg>[K]) {
        super.setProp(key, value);

        if (
            key === 'markdownLinkTarget' || key === 'syntaxHighlighter' ||
            key === 'skipStreamingAnimation' || key === 'streamingAnimationSpeed'
        ) {
            const updateKey = key satisfies keyof CompConversationProps<AiMsg>;
            const updateValue = value as CompConversationProps<AiMsg>[typeof updateKey];
            this.conversation.updateMarkdownStreamRenderer(updateKey, updateValue);
        }
    }

    private addConversation(
        botPersona?: BotPersona,
        userPersona?: UserPersona,
        initialConversationContent?: ChatItem<AiMsg>[],
    ) {
        this.conversation = comp(CompConversation<AiMsg>)
            .withContext(this.context)
            .withProps<CompConversationProps<AiMsg>>({
                botPersona,
                userPersona,
                messages: initialConversationContent,
                markdownLinkTarget: this.props.markdownLinkTarget,
                skipStreamingAnimation: this.props.skipStreamingAnimation,
                streamingAnimationSpeed: this.props.streamingAnimationSpeed,
                syntaxHighlighter: this.props.syntaxHighlighter,
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
        const promptBoxProps: Partial<PromptBoxProps> | undefined = this.props.promptBox;
        submitPromptFactory({
            context: this.context,
            promptBoxInstance: this.promptBoxInstance,
            conversation: this.conversation,
            messageToSend: this.promptBoxText,
            autoScrollController: this.autoScrollController,
            resetPromptBox: (resetTextInput?: boolean) => {
                // Check to handle edge case when reset is called after the component is destroyed!
                // Example: When the user submits a message and the component is destroyed before the response is
                // received.
                if (!this.destroyed) {
                    this.resetPromptBox(resetTextInput, promptBoxProps?.autoFocus);
                }
            },
            setPromptBoxAsWaiting: () => {
                if (!this.destroyed) {
                    this.promptBoxInstance.setDomProps({
                        status: 'waiting',
                    });
                }
            },
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
