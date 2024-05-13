import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import OpenAI from 'openai';
import {NluxUsageError} from '../../../../../../shared/src/types/error';
import {warn} from '../../../../../../shared/src/utils/warn';
import {adapterErrorToExceptionId} from '../../../utils/adapterErrorToExceptionId';
import {conversationHistoryToMessagesList} from '../../../utils/conversationHistoryToMessagesList';
import {decodeChunk} from '../../../utils/decodeChunk';
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

    fetchText(message: string): Promise<AiMsg> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text from the streaming adapter!',
        });
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<AiMsg>): void {
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

                const message = await decodeChunk(value);
                if (message !== undefined) {
                    observer.next(message);
                } else {
                    warn('Undecodable message');
                    warn(value);
                }

                result = await it.next();
            }

            observer.complete();
        }).catch((error: any) => {
            warn(error);
            observer.error(new NluxUsageError({
                source: this.constructor.name,
                message: error.message,
                exceptionId: adapterErrorToExceptionId(error) ?? undefined,
            }));
        });
    }
}
