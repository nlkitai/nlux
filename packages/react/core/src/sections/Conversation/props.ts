import {ReactElement} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {MessageOptions} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';
import {ConversationOptions} from '../../types/conversationOptions';

export type ConversationCompProps<AiMsg> = {

    // State and option props
    segments: ChatSegment<AiMsg>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    messageOptions?: MessageOptions<AiMsg>;

    // Event Handlers
    onLastActiveSegmentChange?: (data: {
        uid: string;
        div: HTMLDivElement;
    } | undefined) => void;

    // UI Overrides
    Loader: ReactElement;
};

export type ImperativeConversationCompProps<AiMsg> = {
    streamChunk: (segmentId: string, messageId: string, chunk: AiMsg) => void;
    completeStream: (segmentId: string, messageId: string) => void;
};
