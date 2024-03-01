import {
    AssistResult,
    ClearContextResult,
    ContextAdapter,
    ContextData,
    GetContextDataResult,
    RegisterTaskResult,
    SetContextResult,
    UnregisterTaskResult,
    UpdateContextResult,
} from '@nlux/core';

export class NLBridgeContextAdapter implements ContextAdapter {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async assist(contextId: string, message: string): Promise<AssistResult> {
        if (!contextId) {
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
                        contextId,
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
                    taskId,
                    parameters,
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

    async clear(contextId: string): Promise<ClearContextResult> {
        if (!contextId) {
            return {
                success: false,
                error: 'Invalid context ID',
            };
        }

        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'clear-context',
                    payload: {
                        contextId,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to clear context',
                };
            }

            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to clear context',
            };
        }
    }

    async get(contextId: string, itemId: string | undefined): Promise<GetContextDataResult> {
        return {
            success: false,
            error: 'Not implemented',
        };
    }

    async registerTask(
        contextId: string,
        taskId: string,
        parameters: string[],
    ): Promise<RegisterTaskResult> {
        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register-task',
                    payload: {
                        contextId,
                        taskId,
                        parameters,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to register task',
                };
            }

            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to register task',
            };
        }
    }

    async set(initialData: Record<string, any> | undefined): Promise<SetContextResult> {
        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'set-context',
                    payload: {
                        data: initialData || null,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to set context',
                };
            }

            const json = await result.json();
            const contextId = json?.result?.contextId;

            return {
                success: true,
                contextId,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to set context',
            };
        }
    }

    async unregisterTask(contextId: string, taskId: string): Promise<UnregisterTaskResult> {
        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'unregister-task',
                    payload: {
                        contextId,
                        taskId,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to unregister task',
                };
            }

            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to unregister task',
            };
        }
    }

    async update(contextId: string, data: ContextData | null): Promise<UpdateContextResult> {
        if (!contextId) {
            return {
                success: false,
                error: 'Invalid context ID',
            };
        }

        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update-context',
                    payload: {
                        contextId,
                        data,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to update context',
                };
            }

            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to update context',
            };
        }
    }
}
