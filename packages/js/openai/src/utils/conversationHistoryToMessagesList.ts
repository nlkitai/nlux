import {ChatItem} from '@nlux/core';
import {participantRoleToOpenAiRole} from './participantRoleToOpenAiRole';

export const conversationHistoryToMessagesList = (
    conversationHistory: readonly ChatItem[],
) => conversationHistory.map((item) => ({
    role: participantRoleToOpenAiRole(item.role),
    content: item.message,
}));
