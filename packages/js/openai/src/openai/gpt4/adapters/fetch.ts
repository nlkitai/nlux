import {Message, NluxUsageError, Observable} from '@nlux/nlux';
import OpenAI from 'openai';
import {gpt4FetchAdapterConfig} from '../config';
import {Gpt4AbstractAdapter} from './adapter';

export class Gpt4FetchAdapter extends Gpt4AbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    constructor({
        actAs,
        apiKey,
        timeout,
        historyDepthToInclude,
    }: {
        actAs?: string;
        apiKey: string;
        timeout: number,
        historyDepthToInclude: number | 'max',
    }) {
        super({
            actAs,
            apiKey,
            timeout,
            historyDepthToInclude,
            dataExchangeMode: 'fetch',
        });
    }

    get config() {
        return gpt4FetchAdapterConfig;
    }

    send(message: Message): Observable<Message> {
        if (typeof message !== 'string' || message.length === 0) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot send empty messages',
            });
        }

        const observable = new Observable<Message>();
        const messagesToSend: {
            role: 'system' | 'user',
            content: string
        }[] = this.actAsMessage ? [{
            role: 'system',
            content: this.actAsMessage,
        }] : [];

        messagesToSend.push({
            role: 'user',
            content: message,
        });

        this.openai.chat.completions.create({
            stream: false,
            model: 'gpt-4',
            messages: messagesToSend,
        }).then(async (response) => {
            const message = await this.decode(response);
            if (message !== undefined) {
                observable.next(message);
            } else {
                // TODO - Handle undecodable messages
            }

            observable.complete();
        });

        return observable;
    }
}
