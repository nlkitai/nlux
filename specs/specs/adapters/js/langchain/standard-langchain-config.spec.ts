import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {createChatAdapter} from '@nlux-dev/langchain/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + withAdapter(langchainAdapter) + with config', () => {
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    describe('With streaming adapter', () => {
        it('Should receive the config object', async () => {
            // Arrange
            let userMessage: any;

            const adapter = createChatAdapter()
                .withUrl('http://localhost:8080')
                .withDataTransferMode('stream')
                .withConfig({
                    value1: 'value1',
                    value2: 22,
                    value3: true,
                    value4: [1, 'abc', true],
                    value5: {
                        key1: 'value1',
                        key2: 22,
                        key3: true,
                        key4: [1, 'abc', true],
                    },
                })
                .withInputPreProcessor((
                    input,
                    conversationHistory,
                ) => {
                    userMessage = input;
                    return {
                        userMessage: input,
                    };
                });

            aiChat = createAiChat()
                .withAdapter(adapter)
                .withInitialConversation([
                    {
                        role: 'user',
                        message: 'Hello AI',
                    },
                    {
                        role: 'assistant',
                        message: 'Hi user',
                    },
                ]);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({output: 'Hi user'}),
            });

            global.fetch = mockFetch;
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'How is the weather today?{enter}');
            await waitForRenderCycle();

            // Assert
            expect(userMessage).toEqual('How is the weather today?');
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8080/stream',
                {
                    body: expect.stringContaining(JSON.stringify({
                        input: {userMessage: 'How is the weather today?'},
                        config: {
                            value1: 'value1',
                            value2: 22,
                            value3: true,
                            value4: [1, 'abc', true],
                            value5: {
                                key1: 'value1',
                                key2: 22,
                                key3: true,
                                key4: [1, 'abc', true],
                            },
                        },
                    })),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                },
            );
        });
    });

    describe('With batch adapter', () => {
        it('Should receive the config object', async () => {
            // Arrange
            let userMessage: any;

            const adapter = createChatAdapter()
                .withUrl('http://localhost:8080')
                .withDataTransferMode('batch')
                .withConfig({
                    value1: 'value1',
                    value2: 22,
                    value3: true,
                    value4: [1, 'abc', true],
                    value5: {
                        key1: 'value1',
                        key2: 22,
                        key3: true,
                        key4: [1, 'abc', true],
                    },
                })
                .withInputPreProcessor((
                    input,
                    conversationHistory,
                ) => {
                    userMessage = input;
                    return {
                        userMessage: input,
                    };
                });

            aiChat = createAiChat()
                .withAdapter(adapter)
                .withInitialConversation([
                    {
                        role: 'user',
                        message: 'Hello AI',
                    },
                    {
                        role: 'assistant',
                        message: 'Hi user',
                    },
                ]);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({output: 'Hi user'}),
            });

            global.fetch = mockFetch;
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'How is the weather today?{enter}');
            await waitForRenderCycle();

            // Assert
            expect(userMessage).toEqual('How is the weather today?');
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8080/invoke',
                {
                    body: expect.stringContaining(JSON.stringify({
                        input: {userMessage: 'How is the weather today?'},
                        config: {
                            value1: 'value1',
                            value2: 22,
                            value3: true,
                            value4: [1, 'abc', true],
                            value5: {
                                key1: 'value1',
                                key2: 22,
                                key3: true,
                                key4: [1, 'abc', true],
                            },
                        },
                    })),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                },
            );
        });
    });
});
