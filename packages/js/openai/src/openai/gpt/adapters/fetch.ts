import {Message, NluxUsageError, StreamingAdapterObserver, warn} from '@nlux/nlux';
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

    send(message: Message): Promise<Message>;
    send(message: Message, observer: StreamingAdapterObserver): void;
    async send(message: Message, observer?: StreamingAdapterObserver<Message>): Promise<Message> {
        if (observer) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Only one parameter "message" is allowed when using the fetch adapter!',
            });
        }

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
        }[] = this.systemMessage ? [{
            role: 'system',
            content: this.systemMessage,
        }] : [];

        messagesToSend.push({
            role: 'user',
            content: messageAsAny,
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
}
