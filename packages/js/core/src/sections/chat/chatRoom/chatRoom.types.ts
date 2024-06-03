import {ChatItem} from '@shared/types/conversation';
import {ComposerProps} from '@shared/components/Composer/props';
import {HighlighterExtension} from '../../../aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../aiChat/options/conversationOptions';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../aiChat/sanitizer/sanitizer';
import {ConversationStarter} from '../../../types/conversationStarter';

export type CompChatRoomEvents = 'chat-room-ready'
    | 'conversation-container-clicked';

export type CompChatRoomProps<AiMsg> = {
    visible?: boolean;
    assistantPersona?: AssistantPersona,
    userPersona?: UserPersona,
    showWelcomeMessage?: boolean;
    conversationStarters?: ConversationStarter[];
    conversationLayout: ConversationLayout;
    initialConversationContent?: ChatItem<AiMsg>[];
    autoScroll?: boolean;
    composer: Partial<ComposerProps>;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
};

export type CompChatRoomElements = {
    composerContainer: HTMLElement;
    conversationContainer: HTMLElement;
    launchPadContainer: HTMLElement;
};

export type CompChatRoomActions = {
    updateChatRoomStatus: (status: 'starting' | 'active') => void;
};
