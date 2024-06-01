import {createAutoScrollController} from '../../../../../../shared/src/interactions/autoScroll/autoScrollController';
import {AutoScrollController} from '../../../../../../shared/src/interactions/autoScroll/type';
import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {ComposerProps} from '../../../../../../shared/src/components/Composer/props';
import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {BaseComp} from '../../../aiChat/comp/base';
import {comp} from '../../../aiChat/comp/comp';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout, HistoryPayloadSize} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {ControllerContext} from '../../../types/controllerContext';
import {ConversationStarter} from '../../../types/conversationStarter';
import {propsToCorePropsInEvents} from '../../../utils/propsToCorePropsInEvents';
import {CompConversation} from '../conversation/conversation.model';
import {CompConversationProps} from '../conversation/conversation.types';
import {CompComposer} from '../composer/composer.model';
import {CompComposerProps} from '../composer/composer.types';
import {submitPromptFactory} from './actions/submitPrompt';
import {renderChatRoom} from './chatRoom.render';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomEvents, CompChatRoomProps} from './chatRoom.types';
import {updateChatRoom} from './chatRoom.update';

@Model('chatRoom', renderChatRoom, updateChatRoom)
export class CompChatRoom<AiMsg> extends BaseComp<
    AiMsg, CompChatRoomProps<AiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
    private autoScrollController: AutoScrollController | undefined;
    private conversation!: CompConversation<AiMsg>;
    private composerInstance!: CompComposer<AiMsg>;
    private composerText: string = '';

    constructor(context: ControllerContext<AiMsg>, {
                    conversationLayout,
                    autoScroll,
                    streamingAnimationSpeed,
                    visible = true,
                    composer,
                    assistantPersona,
                    userPersona,
                    showWelcomeMessage,
                    conversationStarters,
                    initialConversationContent,
                    syntaxHighlighter,
                    htmlSanitizer,
                    markdownLinkTarget,
                    showCodeBlockCopyButton,
                    skipStreamingAnimation,
                }: CompChatRoomProps<AiMsg>,
    ) {
        super(context, {
            conversationLayout,
            visible,
            autoScroll,
            streamingAnimationSpeed,
            assistantPersona,
            userPersona,
            conversationStarters,
            showWelcomeMessage,
            initialConversationContent,
            composer,
            syntaxHighlighter,
            htmlSanitizer,
            markdownLinkTarget,
            showCodeBlockCopyButton,
            skipStreamingAnimation,
        });

        this.addConversation(
            assistantPersona,
            userPersona,
            initialConversationContent,
        );

        this.addComposer(
            composer?.placeholder,
            composer?.autoFocus,
            composer?.disableSubmitButton,
            composer?.submitShortcut,
        );

        if (!this.conversation || !this.composerInstance) {
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
        this.composerInstance?.focusTextInput();
    }

    @CompEventListener('chat-room-ready')
    onChatRoomReady() {
        domOp(() => {
            const conversationContainer = this.renderedDom?.elements?.conversationContainer;
            if (conversationContainer instanceof HTMLElement) {
                this.autoScrollController = createAutoScrollController(
                    conversationContainer,
                    (this.getProp('autoScroll') as boolean | undefined) ?? true,
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
                aiChatProps: propsToCorePropsInEvents(this.context.aiChatProps),
            });
        });
    }

    public setProps(props: Partial<CompChatRoomProps<AiMsg>>) {
        if (props.hasOwnProperty('autoScroll')) {
            const autoScroll = props.autoScroll!;
            this.autoScrollController?.updateProps({autoScroll});
        }

        if (props.hasOwnProperty('conversationLayout')) {
            this.conversation?.setConversationLayout(props.conversationLayout!);
        }

        if (props.hasOwnProperty('syntaxHighlighter')) {
            this.setProp('syntaxHighlighter', props.syntaxHighlighter!);
        }

        if (props.hasOwnProperty('htmlSanitizer')) {
            this.setProp('htmlSanitizer', props.htmlSanitizer!);
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

        if (props.hasOwnProperty('assistantPersona')) {
            this.conversation?.setAssistantPersona(props.assistantPersona ?? undefined);
        }

        if (props.hasOwnProperty('userPersona')) {
            this.conversation?.setUserPersona(props.userPersona ?? undefined);
        }

        if (props.hasOwnProperty('showWelcomeMessage')) {
            this.conversation?.setShowWelcomeMessage(props.showWelcomeMessage ?? true);
        }

        if (props.hasOwnProperty('conversationStarters')) {
            this.conversation?.setConversationStarters(props.conversationStarters);
        }

        if (props.hasOwnProperty('composer')) {
            if (this.composerInstance) {
                const currentDomProps = this.composerInstance.getProp('domCompProps')!;
                const newProps: ComposerProps = {
                    ...currentDomProps,
                    ...props.composer,
                };

                this.composerInstance.setDomProps(newProps);
            }
        }
    }

    public show() {
        this.setProp('visible', true);
    }

    protected setProp<K extends keyof CompChatRoomProps<AiMsg>>(key: K, value: CompChatRoomProps<AiMsg>[K]) {
        super.setProp(key, value);

        if (
            key === 'markdownLinkTarget' || key === 'syntaxHighlighter' || key === 'htmlSanitizer' ||
            key === 'skipStreamingAnimation' || key === 'streamingAnimationSpeed'
        ) {
            const updateKey = key satisfies keyof CompConversationProps<AiMsg>;
            const updateValue = value as CompConversationProps<AiMsg>[typeof updateKey];
            this.conversation.updateMarkdownStreamRenderer(updateKey, updateValue);
        }
    }

    private addConversation(
        assistantPersona?: AssistantPersona,
        userPersona?: UserPersona,
        initialConversationContent?: ChatItem<AiMsg>[],
    ) {
        this.conversation = comp(CompConversation<AiMsg>)
            .withContext(this.context)
            .withProps<CompConversationProps<AiMsg>>({
                assistantPersona,
                userPersona,
                showWelcomeMessage: this.getProp('showWelcomeMessage') as boolean | undefined,
                messages: initialConversationContent,
                conversationStarters: this.getProp('conversationStarters') as ConversationStarter[] | undefined,
                conversationLayout: this.getProp('conversationLayout') as ConversationLayout,
                markdownLinkTarget: this.getProp('markdownLinkTarget') as 'blank' | 'self' | undefined,
                showCodeBlockCopyButton: this.getProp('showCodeBlockCopyButton') as boolean | undefined,
                skipStreamingAnimation: this.getProp('skipStreamingAnimation') as boolean | undefined,
                streamingAnimationSpeed: this.getProp('streamingAnimationSpeed') as number | undefined,
                syntaxHighlighter: this.getProp('syntaxHighlighter') as HighlighterExtension | undefined,
                htmlSanitizer: this.getProp('htmlSanitizer') as ((html: string) => string) | undefined,
            })
            .create();

        this.addSubComponent(
            this.conversation.id,
            this.conversation,
            'conversationContainer',
        );
    }

    private addComposer(
        placeholder?: string,
        autoFocus?: boolean,
        disableSubmitButton?: boolean,
        submitShortcut?: 'Enter' | 'CommandEnter',
    ) {
        this.composerInstance = comp(CompComposer<AiMsg>).withContext(this.context).withProps({
            props: {
                domCompProps: {
                    status: 'typing',
                    placeholder,
                    autoFocus,
                    disableSubmitButton,
                    submitShortcut,
                },
            } satisfies CompComposerProps,
            eventListeners: {
                onTextUpdated: (newValue: string) => this.handleComposerTextChange(newValue),
                onSubmit: () => this.handleComposerSubmit(),
            },
        }).create();

        this.addSubComponent(this.composerInstance.id, this.composerInstance, 'composerContainer');
    }

    private handleComposerSubmit() {
        const composerProps: Partial<ComposerProps> | undefined = this.props.composer;
        submitPromptFactory({
            context: this.context,
            composerInstance: this.composerInstance,
            conversation: this.conversation,
            messageToSend: this.composerText,
            autoScrollController: this.autoScrollController,
            resetComposer: (resetTextInput?: boolean) => {
                // Check to handle edge case when reset is called after the component is destroyed!
                // Example: When the user submits a message and the component is destroyed before the response is
                // received.
                if (!this.destroyed) {
                    this.resetComposer(resetTextInput, composerProps?.autoFocus);
                }
            },
            setComposerAsWaiting: () => {
                if (!this.destroyed) {
                    this.composerInstance.setDomProps({
                        status: 'waiting',
                    });
                }
            },
        })();
    }

    private handleComposerTextChange(newValue: string) {
        this.composerText = newValue;
    }

    private resetComposer(resetTextInput: boolean = false, focusOnReset: boolean = false) {
        if (!this.composerInstance) {
            return;
        }

        const currentCompProps = this.composerInstance.getProp('domCompProps') as ComposerProps;
        const newProps: ComposerProps = {
            ...currentCompProps,
            status: 'typing',
        };

        if (resetTextInput) {
            newProps.message = '';
        }

        this.composerInstance.setDomProps(newProps);

        if (focusOnReset) {
            this.composerInstance.focusTextInput();
        }
    }
}
