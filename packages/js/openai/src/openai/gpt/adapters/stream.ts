import {Message, NluxUsageError, StreamingAdapterObserver} from '@nlux/nlux';
import OpenAI from 'openai';
import {adapterErrorToExceptionId} from '../../../x/adapterErrorToExceptionId';
import {warn} from '../../../x/debug';
import {gptStreamingAdapterConfig} from '../config';
import {OpenAIChatModel} from '../types/models';
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

    send(message: Message, observer: StreamingAdapterObserver<Message>): void {
        const messageAsAny = message as any;
        if (typeof messageAsAny !== 'string' || messageAsAny.length === 0) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot send empty messages',
            });
        }

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
            content: messageAsAny,
        });

        this.openai.chat.completions.create({
            stream: true,
            model: this.model,
            messages: messagesToSend,
        }).then(async (response) => {
            const fullResponse: string[] = [];
            let it = response[Symbol.asyncIterator]();
            let result = await it.next();

            while (!result.done) {
                const value = result.value;
                const message = await this.decode(value);
                if (message !== undefined) {
                    observer.next(message);
                } else {
                    // TODO - Handle undecodable messages
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
