import {HfInference, TextGenerationOutput, TextGenerationStreamOutput} from '@huggingface/inference';
import {
    DataTransferMode,
    Message,
    NluxError,
    NluxValidationError,
    StandardAdapter,
    StandardAdapterConfig,
    StandardAdapterInfo,
    StandardAdapterStatus,
    StreamingAdapterObserver,
    warn,
} from '@nlux/nlux';
import {adapterErrorToExceptionId} from '../../x/adapterErrorToExceptionId';
import {HfAdapterOptions} from '../types/adapterOptions';

export class HfAdapterImpl implements StandardAdapter<any, any> {
    static baseUrl = 'https://api-inference.huggingface.co/models';
    static defaultDataTransferMode: DataTransferMode = 'fetch';
    static defaultMaxNewTokens = 500;

    private inference: HfInference;
    private options: HfAdapterOptions;

    constructor(options: HfAdapterOptions) {
        if (!options.model) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'when creating the Hugging Face adapter, you must set either the model or the endpoint '
                    + 'using the "endpoint" option!',
            });
        }

        this.options = {...options};
        this.inference = new HfInference(options.authToken);
    }

    get config(): StandardAdapterConfig<any, any> {
        return {
            encodeMessage: (message: Message) => {
                return Promise.resolve(message);
            },
            decodeMessage: (payload: any) => {
                return Promise.resolve(payload);
            },
        };
    }

    get dataTransferMode(): DataTransferMode {
        return this.options.dataTransferMode ?? HfAdapterImpl.defaultDataTransferMode;
    }

    get id(): string {
        return '';
    }

    get info(): StandardAdapterInfo {
        return {
            id: '',
            capabilities: {
                textChat: true,
                audio: false,
                fileUpload: false,
                replyToSingleMessage: false,
            },
            remote: {
                url: '',
            },
            inputFormats: ['text'],
            outputFormats: ['text'],
        };
    }

    get status(): StandardAdapterStatus {
        return 'idle';
    }

    async decode(payload: any): Promise<Message> {
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

    async encode(message: Message): Promise<Message> {
        const messageAsAny = message as any;
        const {preProcessors: {input: inputPreProcessor} = {}} = this.options;
        if (inputPreProcessor && messageAsAny) {
            if (typeof messageAsAny === 'string') {
                return inputPreProcessor(messageAsAny, null, this.options);
            } else {
                warn(
                    'The input pre-processor function was provided, but the message is not a string! ' +
                    'Input pre-processor will not be applied.',
                );
            }
        }

        return message;
    }

    send(message: Message): Promise<Message>

    send(message: Message, observer: StreamingAdapterObserver): void;

    send(message: string, observer?: StreamingAdapterObserver): void | Promise<Message> {
        const promise = new Promise<Message>(async (resolve, reject) => {
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
                    this.sendStream(readyMessage, observer!);
                    return;
                }

                // Return fetch promise when data transfer mode is 'fetch'
                const result = await this.sendFetch(readyMessage);
                resolve(result);
            } catch (error: any) {
                reject(error);
            }
        });

        if (this.dataTransferMode === 'fetch') {
            return promise;
        }
    }

    private async sendFetch(message: Message): Promise<Message> {
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
                max_new_tokens: this.options.maxNewTokens ?? HfAdapterImpl.defaultMaxNewTokens,
            },
        };

        let output: TextGenerationOutput | undefined = undefined;

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

    private sendStream(message: Message, observer: StreamingAdapterObserver<Message>) {
        Promise.resolve().then(async () => {
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
                    max_new_tokens: this.options.maxNewTokens ?? HfAdapterImpl.defaultMaxNewTokens,
                },
            };

            let output: AsyncGenerator<TextGenerationStreamOutput, any, unknown> | undefined = undefined;

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

                    observer.next(await this.decode(value.token));
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
}
