import {HfInference, TextGenerationStreamOutput} from '@huggingface/inference';
import {DataTransferMode, StandardAdapterInfo, StandardChatAdapter, StreamingAdapterObserver} from '@nlux/core';
import {NluxError, NluxValidationError} from '../../../../../shared/src/types/error';
import {uid} from '../../../../../shared/src/utils/uid';
import {warn} from '../../../../../shared/src/utils/warn';
import {adapterErrorToExceptionId} from '../../utils/adapterErrorToExceptionId';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';

export class HfChatAdapterImpl<MessageType> implements StandardChatAdapter<MessageType> {
    static defaultDataTransferMode: DataTransferMode = 'fetch';
    static defaultMaxNewTokens = 500;

    private readonly __instanceId: string;

    private inference: HfInference;
    private readonly options: ChatAdapterOptions<MessageType>;

    constructor(options: ChatAdapterOptions<MessageType>) {
        if (!options.model && !options.endpoint) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'when creating the Hugging Face adapter, you must set either the model or the endpoint '
                    + 'using the "endpoint" option!',
            });
        }

        this.__instanceId = `${this.info.id}-${uid()}`;

        this.options = {...options};
        this.inference = new HfInference(options.authToken);
    }

    get dataTransferMode(): DataTransferMode {
        return this.options.dataTransferMode ?? HfChatAdapterImpl.defaultDataTransferMode;
    }

    get id(): string {
        return this.__instanceId;
    }

    get info(): StandardAdapterInfo {
        return {
            id: 'hugging-face-adapter',
            capabilities: {
                chat: true,
                fileUpload: false,
                textToSpeech: false,
                speechToText: false,
            },
        };
    }

    async fetchText(message: string): Promise<MessageType> {
        if (!this.options.model && !this.options.endpoint) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'Unable to send message! When sending a message to the Hugging Face API, you must set either '
                    + 'the model using the "model" option or the endpoint using the "endpoint" option!',
            });
        }

        const parameters = {
            inputs: message as string,
            parameters: {
                max_new_tokens: this.options.maxNewTokens ?? HfChatAdapterImpl.defaultMaxNewTokens,
            },
        };

        let output: any = undefined;

        try {
            if (this.options.endpoint) {
                const endpoint = this.inference.endpoint(this.options.endpoint);
                output = await endpoint.textGeneration(parameters);
            } else {
                output = await this.inference.textGeneration({
                    model: this.options.model,
                    ...parameters,
                });
            }
        } catch (error: any) {
            throw new NluxError({
                source: this.constructor.name,
                message: `An error occurred while sending the message to the Hugging Face API: ${error.message}`,
                exceptionId: adapterErrorToExceptionId(error) ?? undefined,
            });
        }

        return await this.decode(output);
    }

    send(message: string, observer?: StreamingAdapterObserver): void | Promise<MessageType> {
        const promise = new Promise<MessageType>(async (resolve, reject) => {
            if (!message) {
                throw new NluxValidationError({
                    source: this.constructor.name,
                    message: 'The first argument to the send() method must be a non-empty string',
                });
            }

            if (this.dataTransferMode === 'stream' && !observer) {
                throw new NluxValidationError({
                    source: this.constructor.name,
                    message: 'The Hugging Face adapter is set to be used in streaming mode, but no observer was ' +
                        'provided to the send() method! You should either provide an observer as a second argument ' +
                        'to the send() method or set the data loading mode to fetch when creating the adapter.',
                });
            }

            try {
                const readyMessage = await this.encode(message);

                // Send message to the Hugging Face API
                if (this.dataTransferMode === 'stream') {
                    this.streamText(readyMessage, observer!);
                    return;
                }

                // Return fetch promise when data transfer mode is 'fetch'
                const result = await this.fetchText(readyMessage);
                resolve(result);
            } catch (error: any) {
                reject(error);
            }
        });

        if (this.dataTransferMode === 'fetch') {
            return promise;
        }
    }

    streamText(message: string, observer: StreamingAdapterObserver) {
        Promise.resolve().then(async () => {
            if (!this.options.model && !this.options.endpoint) {
                throw new NluxValidationError({
                    source: this.constructor.name,
                    message: 'Unable to send message! When sending a message to the Hugging Face API, you must set either '
                        + 'the model using the "model" option or the endpoint using the "endpoint" option!',
                });
            }

            const readyMessage = await this.encode(message);
            const parameters = {
                inputs: readyMessage,
                parameters: {
                    max_new_tokens: this.options.maxNewTokens ?? HfChatAdapterImpl.defaultMaxNewTokens,
                },
            };

            let output: AsyncGenerator<TextGenerationStreamOutput> | undefined = undefined;

            try {
                if (this.options.endpoint) {
                    const endpoint = this.inference.endpoint(this.options.endpoint);
                    output = endpoint.textGenerationStream(parameters);
                } else {
                    output = this.inference.textGenerationStream({
                        model: this.options.model,
                        ...parameters,
                    });
                }

                while (true) {
                    const result = await output.next();
                    const {done, value} = result;
                    if (done) {
                        break;
                    }

                    observer.next(
                        await this.decode(value.token) as any,
                    );
                }

                observer.complete();
            } catch (error: any) {
                observer.error(error);
                warn(
                    'An error occurred while sending the message to the Hugging Face streaming API: \n'
                    + error.message,
                );
            }
        });
    }

    private async decode(payload: any): Promise<MessageType> {
        const output = (() => {
            if (typeof payload === 'string') {
                return payload;
            }

            if (Array.isArray(payload)) {
                if (payload.length === 0) {
                    return '';
                }

                const responseToConsider = payload[0];
                if (
                    typeof responseToConsider === 'object' && responseToConsider &&
                    typeof responseToConsider.generated_text === 'string'
                ) {
                    return responseToConsider.generated_text;
                }
            }

            if (typeof payload === 'object' && payload && typeof payload.generated_text === 'string') {
                return payload.generated_text;
            }

            if (typeof payload === 'object' && payload && typeof payload.text === 'string') {
                return payload.text;
            }

            return '';
        })();

        const {preProcessors: {output: outputPreProcessor} = {}} = this.options;
        if (outputPreProcessor) {
            return Promise.resolve(outputPreProcessor(output));
        } else {
            return Promise.resolve(output);
        }
    }

    private async encode(message: string): Promise<string> {
        const messageAsAny = message as any;
        const {preProcessors: {input: inputPreProcessor} = {}} = this.options;
        if (inputPreProcessor && messageAsAny) {
            if (typeof messageAsAny === 'string') {
                return inputPreProcessor(messageAsAny, this.options);
            } else {
                warn(
                    'The input pre-processor function was provided, but the message is not a string! ' +
                    'Input pre-processor will not be applied.',
                );
            }
        }

        return message;
    }
}
