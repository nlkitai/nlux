import {createAutoScrollController} from '@shared/interactions/autoScroll/autoScrollController';
import {AutoScrollController} from '@shared/interactions/autoScroll/type';
import {ChatItem} from '@shared/types/conversation';
import {ComposerProps} from '@shared/components/Composer/props';
import {domOp} from '@shared/utils/dom/domOp';
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
import {CompLaunchPad} from '../launchPad/launchPad.model';
import {CompLaunchPadProps} from '../launchPad/launchPad.types';
import {getChatRoomStatus} from './utils/getChatRoomStatus';

@Model('chatRoom', renderChatRoom, updateChatRoom)
export class CompChatRoom<AiMsg> extends BaseComp<
    AiMsg, CompChatRoomProps<AiMsg>, CompChatRoomElements, CompChatRoomEvents, CompChatRoomActions
> {
    private launchPad: CompLaunchPad<AiMsg> | undefined;
    private conversation!: CompConversation<AiMsg>;
    private composer!: CompComposer<AiMsg>;

    private prompt: string = '';
    private autoScrollController: AutoScrollController | undefined;

    private chatRoomStatus: 'starting' | 'active'; // Starting = Display launch pad, Active = Display conversation
    private segmentCount: number; // How many segments are in the conversation (used to determine the chat room status)

    constructor(
        context: ControllerContext<AiMsg>, {
            conversationLayout,
            autoScroll,
            streamingAnimationSpeed,
            visible = true,
            composer,
            assistantPersona,
            userPersona,
            showGreeting,
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
            showGreeting,
            initialConversationContent,
            composer,
            syntaxHighlighter,
            htmlSanitizer,
            markdownLinkTarget,
            showCodeBlockCopyButton,
            skipStreamingAnimation,
        });

        // Set status
        this.segmentCount = initialConversationContent && initialConversationContent.length > 0 ? 1 : 0;
        this.chatRoomStatus = getChatRoomStatus(initialConversationContent, this.segmentCount);

        // Add optional launch pad component
        if (this.chatRoomStatus === 'starting') {
            this.addLaunchPad(
                showGreeting, assistantPersona,
                conversationStarters, this.handleConversationStarterClick,
            );
        }

        // Add required conversation and composer components
        this.addConversation(assistantPersona, userPersona, initialConversationContent);
        this.addComposer(
            composer?.placeholder, composer?.autoFocus,
            composer?.disableSubmitButton, composer?.submitShortcut,
        );

        if (!this.conversation || !this.composer) {
            // The conversation and the composer are mandatory components
            throw new Error('Chat room not initialized — An error occurred while initializing key components.');
        }
    }

    public getConversationContentForAdapter(historyPayloadSize: HistoryPayloadSize = 'max') {
        return this.conversation.getConversationContentForAdapter(historyPayloadSize);
    }

    public hide() {
        this.setProp('visible', false);
    }

    @CompEventListener('conversation-container-clicked')
    messagesContainerClicked() {
        this.composer?.focusTextInput();
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
            this.launchPad?.setAssistantPersona(props.assistantPersona ?? undefined);
        }

        if (props.hasOwnProperty('userPersona')) {
            this.conversation?.setUserPersona(props.userPersona ?? undefined);
        }

        if (props.hasOwnProperty('showGreeting')) {
            this.launchPad?.setShowGreeting(props.showGreeting ?? true);
        }

        if (props.hasOwnProperty('conversationStarters')) {
            this.launchPad?.setConversationStarters(props.conversationStarters);
        }

        if (props.hasOwnProperty('composer')) {
            if (this.composer) {
                const currentDomProps = this.composer.getProp('domCompProps')!;
                const newProps: ComposerProps = {...currentDomProps, ...props.composer};
                this.composer.setDomProps(newProps);
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

    private addLaunchPad(
        showGreeting: boolean | undefined,
        assistantPersona: AssistantPersona | undefined,
        conversationStarters: ConversationStarter[] | undefined,
        onConversationStarterSelected: (conversationStarter: ConversationStarter) => void,
    ) {
        this.launchPad = comp(CompLaunchPad<AiMsg>)
            .withContext(this.context)
            .withProps({
                showGreeting,
                assistantPersona,
                conversationStarters,
                onConversationStarterSelected,
            } satisfies CompLaunchPadProps)
            .create();

        this.addSubComponent(this.launchPad.id, this.launchPad, 'launchPadContainer');
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
                messages: initialConversationContent,
                conversationLayout: this.getProp('conversationLayout') as ConversationLayout,
                markdownLinkTarget: this.getProp('markdownLinkTarget') as 'blank' | 'self' | undefined,
                showCodeBlockCopyButton: this.getProp('showCodeBlockCopyButton') as boolean | undefined,
                skipStreamingAnimation: this.getProp('skipStreamingAnimation') as boolean | undefined,
                streamingAnimationSpeed: this.getProp('streamingAnimationSpeed') as number | undefined,
                syntaxHighlighter: this.getProp('syntaxHighlighter') as HighlighterExtension | undefined,
                htmlSanitizer: this.getProp('htmlSanitizer') as ((html: string) => string) | undefined,
                onSegmentCountChange: this.handleSegmentCountChange,
            })
            .create();

        this.addSubComponent(this.conversation.id, this.conversation, 'conversationContainer');
    }

    private addComposer(
        placeholder?: string,
        autoFocus?: boolean,
        disableSubmitButton?: boolean,
        submitShortcut?: 'Enter' | 'CommandEnter',
    ) {
        this.composer = comp(CompComposer<AiMsg>).withContext(this.context).withProps({
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

        this.addSubComponent(this.composer.id, this.composer, 'composerContainer');
    }

    private handleConversationStarterClick = (conversationStarter: ConversationStarter) => {
        // Set the prompt
        // Disable the composer and submit button
        // Set the composer as waiting
        // Submit the prompt

        this.composer.setDomProps({status: 'submitting-conversation-starter'});
        this.composer.handleTextChange(conversationStarter.prompt);
        this.composer.handleSendButtonClick();
    };

    private handleComposerSubmit() {
        const composerProps: Partial<ComposerProps> | undefined = this.props.composer;
        submitPromptFactory({
            context: this.context,
            composerInstance: this.composer,
            conversation: this.conversation,
            messageToSend: this.prompt,
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
                    this.composer.setDomProps({status: 'waiting'});
                }
            },
        })();
    }

    private handleComposerTextChange(newValue: string) {
        this.prompt = newValue;
    }

    private handleSegmentCountChange = (newSegmentCount: number) => {
        if (this.segmentCount === newSegmentCount) {
            return;
        }

        this.segmentCount = newSegmentCount;
        const newChatRoomStatus = getChatRoomStatus(
            (this.getProp('initialConversationContent') || undefined) as ChatItem<AiMsg>[] | undefined,
            this.segmentCount,
        );

        if (this.chatRoomStatus !== newChatRoomStatus) {
            this.chatRoomStatus = newChatRoomStatus;
            this.executeDomAction('updateChatRoomStatus', this.chatRoomStatus);

            if (this.chatRoomStatus === 'active') {
                if (this.launchPad?.id) {
                    this.removeSubComponent(this.launchPad?.id);
                    this.launchPad = undefined;
                }
            } else {
                this.addLaunchPad(
                    (this.getProp('showGreeting') as boolean | undefined) ?? true,
                    this.getProp('assistantPersona') as AssistantPersona | undefined,
                    this.getProp('conversationStarters') as ConversationStarter[] | undefined,
                    this.handleConversationStarterClick,
                );
            }
        }
    };

    private resetComposer(resetTextInput: boolean = false, focusOnReset: boolean = false) {
        if (!this.composer) {
            return;
        }

        const currentCompProps = this.composer.getProp('domCompProps') as ComposerProps;
        const newProps: ComposerProps = {...currentCompProps, status: 'typing'};
        if (resetTextInput) {
            newProps.message = '';
        }

        this.composer.setDomProps(newProps);
        if (focusOnReset) {
            this.composer.focusTextInput();
        }
    }
}
