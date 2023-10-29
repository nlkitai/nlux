import {Message, NluxUsageError, Observable} from '@nlux/nlux';
import OpenAI from 'openai';
import {gpt4StreamingAdapterConfig} from '../config';
import {Gpt4AbstractAdapter} from './adapter';

export class Gpt4StreamingAdapter extends Gpt4AbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletionChunk,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    private initialSystemMessage: string | null = null;
    private shouldSendInitialSystemMessage: boolean = false;

    constructor({
        actAs,
        apiKey,
        timeout,
        historyDepthToInclude,
        initialSystemMessage,
    }: {
        actAs?: string;
        apiKey: string;
        timeout: number,
        historyDepthToInclude: number | 'max',
        initialSystemMessage?: string;
    }) {
        super({
            actAs,
            apiKey,
            timeout,
            historyDepthToInclude,
            dataExchangeMode: 'fetch',
        });

        if (initialSystemMessage !== undefined && initialSystemMessage.length > 0) {
            this.initialSystemMessage = initialSystemMessage;
            this.shouldSendInitialSystemMessage = true;
        }
    }

    get config() {
        return gpt4StreamingAdapterConfig;
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

        console.dir(this.shouldSendInitialSystemMessage);
        console.log(this.initialSystemMessage);
        if (this.shouldSendInitialSystemMessage) {
            messagesToSend.push({
                role: 'system',
                content: this.initialSystemMessage!,
            });

            // TODO - Only set this to false after the initial system message has been sent
            this.shouldSendInitialSystemMessage = false;
        }

        messagesToSend.push({
            role: 'user',
            content: message,
        });

        this.openai.chat.completions.create({
            stream: true,
            model: 'gpt-4',
            messages: messagesToSend,
        }).then(async (response) => {
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
