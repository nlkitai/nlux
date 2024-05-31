import {ConversationOptions as CoreConversationOptions} from '@nlux/core';
import {ConversationStarter} from './conversationStarter';

export type ConversationOptions = Omit<CoreConversationOptions, 'conversationStarters'> & {
    /**
     * Suggested prompts to display in the UI to help the user start a conversation.
     * Conversation starters are only displayed when the conversation is empty, and no conversation history is present.
     */
    conversationStarters?: ConversationStarter[];
}
