import {AssistantPersona} from '../../../aiChat/options/personaOptions';
import {ConversationStarter} from '../../../types/conversationStarter';

export type CompLaunchPadEvents = 'conversation-starter-clicked';

export type CompLaunchPadProps = {
    // By default, either the assistant greeting message or NLUX logo will be shown
    // When this is set to false, no greeting will be shown
    showGreeting?: boolean;

    // Use to display the assistant greeting message
    assistantPersona?: AssistantPersona;

    // Conversation starters to be displayed
    conversationStarters?: ConversationStarter[];
    onConversationStarterSelected: (conversationStarter: ConversationStarter) => void;
};

export type CompLaunchPadElements = {
    conversationStartersContainer: HTMLElement;
};

export type CompLaunchPadActions = {
    resetGreeting: () => void;
    updateAssistantPersona: (assistantPersona: AssistantPersona | undefined) => void;
};
