import {Message, NluxUsageError, StreamingAdapterObserver} from '@nlux/nlux';
import OpenAI from 'openai';
import {adapterErrorToExceptionId} from '../../../x/adapterErrorToExceptionId';
import {warn} from '../../../x/debug';
import {gptFetchAdapterConfig} from '../config';
import {OpenAIChatModel} from '../types/models';
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

    send(message: Message, observer: StreamingAdapterObserver<Message>): void {
        const messageAsAny = message as any;
        if (typeof messageAsAny !== 'string' || messageAsAny.length === 0) {
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
            content: messageAsAny,
        });

        this.openai.chat.completions.create({
            stream: false,
            model: this.model,
            messages: messagesToSend,
        }).then(async (response: any) => {
            const message: any = await this.decode(response);
            if (typeof message !== 'string') {
                observer.error(new NluxUsageError({
                    source: this.constructor.name,
                    message: 'Unable to decode response from OpenAI',
                }));
            } else {
                observer.next(message);
            }
        }).catch((error: any) => {
            warn('Error while making API call to OpenAI');
            warn(error);
            observer.error(new NluxUsageError({
                source: this.constructor.name,
                message: error.message,
                exceptionId: adapterErrorToExceptionId(error) ?? undefined,
            }));
        });
    }
}
