import {ReactElement} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {MessageOptions} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';
import {ConversationOptions} from '../../types/conversationOptions';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';

export type ConversationCompProps<AiMsg> = {

    // State and option props
    segments: ChatSegment<AiMsg>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    messageOptions?: MessageOptions<AiMsg>;
    markdownContainersController: MarkdownContainersController;
    submitShortcutKey?: 'Enter' | 'CommandEnter';

    // Event Handlers
    onLastActiveSegmentChange?: (data: {
        uid: string;
        div: HTMLDivElement;
    } | undefined) => void;

    onPromptResubmit: (
        segmentId: string,
        messageId: string,
        newPrompt: string,
    ) => void;

    // UI Overrides
    Loader: ReactElement;
};

export type ImperativeConversationCompProps<AiMsg> = {
    streamChunk: (segmentId: string, messageId: string, chunk: AiMsg) => void;
    completeStream: (segmentId: string, messageId: string) => void;
};
