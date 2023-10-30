import {Message, NluxUsageError} from '@nlux/nlux';
import OpenAI from 'openai';
import {gptFetchAdapterConfig} from '../config';
import {OpenAIChatModel} from '../types/models.ts';
import {GptAbstractAdapter} from './adapter';

export class GptFetchAdapter extends GptAbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    constructor({
        apiKey,
        model,
        initialSystemMessage,
    }: {
        apiKey: string;
        model: OpenAIChatModel,
        initialSystemMessage?: string;
    }) {
        super({
            apiKey,
            model,
            initialSystemMessage,
            dataExchangeMode: 'fetch',
        });

        if (initialSystemMessage !== undefined && initialSystemMessage.length > 0) {
            this.initialSystemMessage = initialSystemMessage;
        }
    }

    get config() {
        return gptFetchAdapterConfig;
    }

    send(message: Message): Promise<Message> {
        return new Promise((resolve, reject) => {
            if (typeof message !== 'string' || message.length === 0) {
                throw new NluxUsageError({
                    source: this.constructor.name,
                    message: 'Cannot send empty messages',
                });
            }

            const messagesToSend: {
                role: 'system' | 'user',
                content: string
            }[] = this.initialSystemMessage ? [{
                role: 'system',
                content: this.initialSystemMessage,
            }] : [];

            messagesToSend.push({
                role: 'user',
                content: message,
            });

            this.openai.chat.completions.create({
                stream: false,
                model: this.model,
                messages: messagesToSend,
            }).then(async (response: any) => {
                const message: any = await this.decode(response);
                if (typeof message !== 'string') {
                    reject(new NluxUsageError({
                        source: this.constructor.name,
                        message: 'Unable to decode response from OpenAI',
                    }));
                } else {
                    resolve(message);
                }
            });
        });
    }
}
