import {ConversationItem} from '@nlux/core';
import {participantRoleToOpenAiRole} from './participantRoleToOpenAiRole';

export const conversationHistoryToMessagesList = (
    conversationHistory: readonly ConversationItem[],
) => conversationHistory.map((item) => ({
    role: participantRoleToOpenAiRole(item.role),
    content: item.message,
}));
