import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import OpenAI from 'openai';
import {NluxUsageError} from '../../../../../../shared/src/types/error';
import {warn} from '../../../../../../shared/src/utils/warn';
import {adapterErrorToExceptionId} from '../../../utils/adapterErrorToExceptionId';
import {conversationHistoryToMessagesList} from '../../../utils/conversationHistoryToMessagesList';
import {decodePayload} from '../../../utils/decodePayload';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';
import {OpenAiAbstractAdapter} from './adapter';

export class OpenAiFetchAdapter<MessageType> extends OpenAiAbstractAdapter<MessageType> {
    constructor({
        apiKey,
        model,
        systemMessage,
    }: ChatAdapterOptions) {
        super({
            apiKey,
            model,
            systemMessage,
            dataTransferMode: 'fetch',
        });

        if (systemMessage !== undefined && systemMessage.length > 0) {
            this.systemMessage = systemMessage;
        }
    }

    async fetchText(message: string, extras: ChatAdapterExtras<MessageType>): Promise<MessageType> {
        const messagesToSend: Array<
            OpenAI.Chat.Completions.ChatCompletionSystemMessageParam |
            OpenAI.Chat.Completions.ChatCompletionUserMessageParam |
            OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
        > = this.systemMessage ? [
            {
                role: 'system',
                content: this.systemMessage,
            },
        ] : [];

        if (extras.conversationHistory) {
            messagesToSend.push(
                ...conversationHistoryToMessagesList(extras.conversationHistory),
            );
        }

        messagesToSend.push({
            role: 'user',
            content: message,
        });

        try {
            const response = await this.openai.chat.completions.create({
                stream: false,
                model: this.model,
                messages: messagesToSend,
            });

            const result = await decodePayload<MessageType>(response);
            if (result === undefined) {
                warn('Undecodable message received from OpenAI');
                throw new NluxUsageError({
                    source: this.constructor.name,
                    message: 'Undecodable message received from OpenAI',
                });
            } else {
                return result;
            }
        } catch (error: any) {
            warn('Error while making API call to OpenAI');
            warn(error);
            throw new NluxUsageError({
                source: this.constructor.name,
                message: error?.message || 'Error while making API call to OpenAI',
                exceptionId: adapterErrorToExceptionId(error) ?? undefined,
            });
        }
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<MessageType>): void {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot stream text from the fetch adapter!',
        });
    }
}
