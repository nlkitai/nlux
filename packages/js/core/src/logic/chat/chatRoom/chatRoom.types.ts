import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {ComposerProps} from '../../../../../../shared/src/ui/Composer/props';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {ConversationLayout} from '../../../exports/aiChat/options/conversationOptions';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';
import {SanitizerExtension} from '../../../exports/aiChat/sanitizer/sanitizer';

export type CompChatRoomEvents = 'chat-room-ready'
    | 'segments-container-clicked';

export type CompChatRoomProps<AiMsg> = {
    visible?: boolean;
    botPersona?: BotPersona,
    userPersona?: UserPersona,
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
    chatRoomContainer: HTMLElement;
    composerContainer: HTMLElement;
    conversationContainer: HTMLElement;
};

export type CompChatRoomActions = void;
