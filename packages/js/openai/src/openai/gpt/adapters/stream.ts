import {NluxUsageError, StreamingAdapterObserver, warn} from '@nlux/nlux';
import OpenAI from 'openai';
import {adapterErrorToExceptionId} from '../../../x/adapterErrorToExceptionId';
import {gptStreamingAdapterConfig} from '../config';
import {OpenAiAdapterOptions} from '../types/adapterOptions';
import {OpenAiAbstractAdapter} from './adapter';

export class OpenAiStreamingAdapter extends OpenAiAbstractAdapter<
    OpenAI.Chat.Completions.ChatCompletionChunk,
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
            dataTransferMode: 'stream',
        });

        if (systemMessage !== undefined && systemMessage.length > 0) {
            this.systemMessage = systemMessage;
        }
    }

    get config() {
        return gptStreamingAdapterConfig;
    }

    fetchText(message: string): Promise<string> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text from the streaming adapter!',
        });
    }

    streamText(message: string, observer: StreamingAdapterObserver): void {
        // TODO - Only send system message once per conversation, when history is included
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
                const finishReason = value.choices?.length > 0 ? value.choices[0].finish_reason : undefined;
                if (finishReason === 'stop') {
                    break;
                }

                const message = await this.decode(value);
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
