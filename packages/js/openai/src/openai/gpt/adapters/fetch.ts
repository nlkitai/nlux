import {NluxUsageError, StreamingAdapterObserver, warn} from '@nlux/core';
import OpenAI from 'openai';
import {adapterErrorToExceptionId} from '../../../x/adapterErrorToExceptionId';
import {gptFetchAdapterConfig} from '../config';
import {OpenAiAdapterOptions} from '../types/adapterOptions';
import {OpenAiAbstractAdapter} from './adapter';

export class OpenAiFetchAdapter extends OpenAiAbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    constructor({
        apiKey,
        model,
        systemMessage,
    }: OpenAiAdapterOptions) {
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

    get config() {
        return gptFetchAdapterConfig;
    }

    async fetchText(message: string): Promise<string> {
        const messagesToSend: {
            role: 'system' | 'user',
            content: string
        }[] = this.systemMessage ? [{
            role: 'system',
            content: this.systemMessage,
        }] : [];

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
            return this.decode(response);
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

    streamText(message: string, observer: StreamingAdapterObserver): void {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot stream text from the fetch adapter!',
        });
    }
}
