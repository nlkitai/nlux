import {AssistAdapter, AssistResult, ChatAdapterExtras} from '@nlux/core';

export class NLBridgeAssistAdapter implements AssistAdapter {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async assist(message: string, extras: ChatAdapterExtras): Promise<AssistResult> {
        if (!extras.contextId) {
            return {
                success: false,
                error: 'Invalid context ID',
            };
        }

        if (!message) {
            return {
                success: false,
                error: 'Invalid message',
            };
        }

        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'assist',
                    payload: {
                        contextId: extras.contextId,
                        message,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to assist',
                };
            }

            const json = await result.json();
            const response = json?.result?.response;
            const taskId = json?.result?.taskId;
            const parameters = json?.result?.parameters;

            if (taskId && Array.isArray(parameters)) {
                return {
                    success: true,
                    response,
                    task: {
                        id: taskId,
                        parameters,
                    },
                };
            }

            return {
                success: true,
                response,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to assist',
            };
        }
    }
}
