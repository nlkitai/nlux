import {ChatItem} from '@nlux/core';
import OpenAI from 'openai';
import {warn} from '../../../../shared/src/utils/warn';
import {participantRoleToOpenAiRole} from './participantRoleToOpenAiRole';

export const conversationHistoryToMessagesList: <AiMsg>(
    conversationHistory: ChatItem<AiMsg>[],
) => Array<
    OpenAI.Chat.Completions.ChatCompletionSystemMessageParam |
    OpenAI.Chat.Completions.ChatCompletionUserMessageParam |
    OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
> = (
    conversationHistory,
) => {
    return conversationHistory.map((item) => {
        let content: string | undefined;

        // We only want to send strings or numbers to OpenAI
        // We convert objects to strings
        if (typeof item.message === 'string' || item.message === 'number') {
            content = `${item.message}`;
        } else {
            if (item.message === 'object') {
                content = JSON.stringify(item.message);
            }
        }

        // We don't want to send empty messages to OpenAI
        if (content === undefined) {
            warn(
                `Empty message or unsupported message format found in conversation history and will ` +
                `not be included in the conversation history sent to OpenAI.`,
            );
            return undefined;
        }

        return {
            role: participantRoleToOpenAiRole(item.role),
            content,
        };
    }).filter((item) => item !== undefined) as Array<
        OpenAI.Chat.Completions.ChatCompletionSystemMessageParam |
        OpenAI.Chat.Completions.ChatCompletionUserMessageParam |
        OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
    >;
};
