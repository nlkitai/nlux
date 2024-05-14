import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxError, NluxUsageError} from '../../../../../shared/src/types/error';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';
import {NLBridgeAbstractAdapter} from './adapter';

export class NLBridgeFetchAdapter<AiMsg = string> extends NLBridgeAbstractAdapter<AiMsg> {
    constructor(options: ChatAdapterOptions) {
        super(options);
    }

    async fetchText(message: string, extras: ChatAdapterExtras<AiMsg>): Promise<AiMsg> {
        if (this.context && this.context.contextId) {
            await this.context.flush();
        }

        const action = this.usageMode === 'copilot' ? 'assist' : 'chat';
        const response = await fetch(this.endpointUrl, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action,
                payload: {
                    message,
                    conversationHistory: extras.conversationHistory,
                    contextId: this.context?.contextId,
                },
            }),
        });

        if (!response.ok) {
            throw new NluxError({
                source: this.constructor.name,
                message: `NLBridge adapter returned status code: ${response.status}`,
            });
        }

        const body = await response.json();
        if (
            typeof body === 'object' && body !== null && body.success === true &&
            typeof body.result === 'object' && body.result !== null &&
            typeof body.result.response === 'string'
        ) {
            const {
                response,
                task,
            } = body.result;

            if (
                this.context && task
                && typeof task === 'object' && typeof task.taskId === 'string'
                && Array.isArray(task.parameters)
            ) {
                this.context.runTask(task.taskId, task.parameters);
            }

            return response;
        } else {
            throw new NluxError({
                source: this.constructor.name,
                message: 'Invalid response from NLBridge: String expected.',
            });
        }
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<AiMsg>): void {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot stream text from the fetch adapter!',
        });
    }
}
