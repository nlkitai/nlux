import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {PromptBoxProps} from '../../../../../../shared/src/ui/PromptBox/props';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {BotPersona, UserPersona} from '../../../exports/aiChat/options/personaOptions';

export type CompChatRoomEvents = 'chat-room-ready'
    | 'segments-container-clicked';

export type CompChatRoomProps<AiMsg> = {
    visible?: boolean;
    botPersona?: BotPersona,
    userPersona?: UserPersona,
    initialConversationContent?: readonly ChatItem<AiMsg>[];
    autoScroll?: boolean;
    promptBox: Partial<PromptBoxProps>;
    openLinksInNewWindow?: boolean;
    skipAnimation?: boolean;
    streamingAnimationSpeed?: number;
    syntaxHighlighter?: HighlighterExtension;
};

export type CompChatRoomElements = {
    chatRoomContainer: HTMLElement;
    promptBoxContainer: HTMLElement;
    conversationContainer: HTMLElement;
};

export type CompChatRoomActions = {};
