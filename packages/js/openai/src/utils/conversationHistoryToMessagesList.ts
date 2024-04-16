import {ChatItem} from '@nlux/core';
import {participantRoleToOpenAiRole} from './participantRoleToOpenAiRole';

export const conversationHistoryToMessagesList = <AiMsg>(
    conversationHistory: readonly ChatItem<AiMsg>[],
) => conversationHistory.map((item) => ({
    role: participantRoleToOpenAiRole(item.role),
    content: item.message,
}));
