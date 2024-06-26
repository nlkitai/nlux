import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {ReactNode} from 'react';
import {PersonaOptions} from '../../exports/personaOptions';
import {ConversationOptions} from '../../types/conversationOptions';
import {ConversationStarter} from '../../types/conversationStarter';

export type LaunchPadProps<AiMsg> = {
    segments: ChatSegment<AiMsg>[];
    personaOptions?: PersonaOptions;
    conversationOptions?: ConversationOptions;
    onConversationStarterSelected: (conversationStarter: ConversationStarter) => void;
    userDefinedGreeting?: ReactNode;
};
