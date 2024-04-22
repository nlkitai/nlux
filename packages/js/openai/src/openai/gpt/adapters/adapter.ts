import {
    ChatAdapterExtras,
    DataTransferMode,
    StandardAdapterInfo,
    StandardChatAdapter,
    StreamingAdapterObserver,
} from '@nlux/core';
import OpenAI from 'openai';
import {uid} from '../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../shared/src/utils/warn';
import {gptAdapterInfo} from '../config';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';
import {OpenAiModel} from '../types/model';
import {defaultChatGptModel, defaultDataTransferMode} from './config';

export abstract class OpenAiAbstractAdapter implements StandardChatAdapter {

    protected readonly model: OpenAiModel;
    protected readonly openai: OpenAI;
    protected systemMessage: string | null = 'Act as a helpful assistant to the user';
    protected readonly theDataTransferMode: DataTransferMode;

    private readonly __instanceId: string;

    protected constructor({
        systemMessage,
        apiKey,
        dataTransferMode,
        model,
    }: ChatAdapterOptions) {
        this.__instanceId = `${this.info.id}-${uid()}`;

        this.theDataTransferMode = dataTransferMode ?? defaultDataTransferMode;
        this.model = model ?? defaultChatGptModel;

        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true,
        });

        if (systemMessage) {
            this.systemMessage = systemMessage;
        }

        warn('OpenAI GPT adapter has been initialized in browser mode using option "dangerouslyAllowBrowser". '
            + 'To learn more about OpenAI\' recommendation for handling API keys, please visit:\n'
            + 'https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n'
            + 'The useUnsafeChatAdapter/createUnsafeChatAdapter are only intended for development and testing purposes.\n\n'
            + 'For production use, we recommend that you implement a server-side proxy and configure a customized '
            + 'adapter for it. To learn more about how to create custom adapters for nlux, visit:\n'
            + 'https://nlux.dev/learn/adapters/custom-adapters',
        );
    }

    get dataTransferMode(): DataTransferMode {
        return this.theDataTransferMode;
    }

    get id() {
        return this.__instanceId;
    }

    get info(): StandardAdapterInfo {
        return gptAdapterInfo;
    }

    abstract fetchText(message: string, extras: ChatAdapterExtras): Promise<string>;

    abstract streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras): void;
}
