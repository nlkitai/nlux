import {Message, NluxUsageError, Observable} from '@nlux/nlux';
import OpenAI from 'openai';
import {gptStreamingAdapterConfig} from '../config';
import {OpenAIChatModel} from '../types/models.ts';
import {GptAbstractAdapter} from './adapter';

export class GptStreamingAdapter extends GptAbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletionChunk,
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
            dataExchangeMode: 'stream',
        });

        if (initialSystemMessage !== undefined && initialSystemMessage.length > 0) {
            this.initialSystemMessage = initialSystemMessage;
        }
    }

    get config() {
        return gptStreamingAdapterConfig;
    }

    send(message: Message): Observable<Message> {
        if (typeof message !== 'string' || message.length === 0) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot send empty messages',
            });
        }

        const observable = new Observable<Message>();

        // TODO - Only send system message once per conversation, when history is included
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
            stream: true,
            model: this.model,
            messages: messagesToSend,
        }).then(async (response: any) => {
            const fullResponse: string[] = [];
            let it = response[Symbol.asyncIterator]();
            let result = await it.next();

            while (!result.done) {
                const value = result.value;
                const message = await this.decode(value);
                if (message !== undefined) {
                    observable.next(message);
                } else {
                    // TODO - Handle undecodable messages
                }

                result = await it.next();
            }

            observable.complete();
        });

        return observable;
    }
}
