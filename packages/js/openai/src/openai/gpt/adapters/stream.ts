import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxUsageError} from '@shared/types/error';
import {warn} from '@shared/utils/warn';
import OpenAI from 'openai';
import {adapterErrorToExceptionId} from '../../../utils/adapterErrorToExceptionId';
import {conversationHistoryToMessagesList} from '../../../utils/conversationHistoryToMessagesList';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';
import {OpenAiAbstractAdapter} from './adapter';

export class OpenAiStreamingAdapter<AiMsg> extends OpenAiAbstractAdapter<AiMsg> {
    constructor({
        apiKey,
        model,
        systemMessage,
    }: ChatAdapterOptions) {
        super({
            apiKey,
            model,
            systemMessage,
            dataTransferMode: 'stream',
        });

        if (systemMessage !== undefined && systemMessage.length > 0) {
            this.systemMessage = systemMessage;
        }
    }

    batchText(message: string): Promise<string | object | undefined> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text from the streaming adapter!',
        });
    }

    streamText(
        message: string,
        observer: StreamingAdapterObserver<string | object | undefined>,
        extras: ChatAdapterExtras<AiMsg>,
    ): void {
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
            const newItems: (
                OpenAI.Chat.Completions.ChatCompletionUserMessageParam |
                OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam |
                OpenAI.Chat.Completions.ChatCompletionSystemMessageParam
                )[] = conversationHistoryToMessagesList(
                extras.conversationHistory).map(
                (item) => {
                    const content: string = typeof item.content === 'string'
                        ? item.content : JSON.stringify(item.content);

                    return {
                        content,
                        role: item.role,
                    };
                },
            );

            messagesToSend.push(...newItems);
        }

        messagesToSend.push({
            role: 'user',
            content: message,
        });

        this.openai.chat.completions.create({
            stream: true,
            model: this.model,
            messages: messagesToSend,
        }).then(async (response) => {
            const it = response[Symbol.asyncIterator]();
            let result = await it.next();

            while (!result.done) {
                const value = result.value;
                const finishReason = value.choices?.length > 0 ? value.choices[0].finish_reason : undefined;
                if (finishReason === 'stop') {
                    break;
                }

                observer.next(value);
                result = await it.next();
            }

            observer.complete();
        }).catch((error) => {
            warn(error);
            observer.error(new NluxUsageError({
                source: this.constructor.name,
                message: error.message,
                exceptionId: adapterErrorToExceptionId(error) ?? undefined,
            }));
        });
    }
}
