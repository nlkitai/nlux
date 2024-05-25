import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {createChatAdapter} from '@nlux-dev/langchain/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + withAdapter(langchainAdapter) + with input pre-processor', () => {
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
        it('Should receive the entire conversation history', async () => {
            // Arrange
            let conversationHistoryInPreProcessor: any;
            let userMessage: any;

            const adapter = createChatAdapter()
                .withUrl('http://localhost:8080')
                .withDataTransferMode('stream')
                .withInputPreProcessor((
                    input,
                    conversationHistory,
                ) => {
                    userMessage = input;
                    conversationHistoryInPreProcessor = conversationHistory;
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

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'How is the weather today?{enter}');
            await waitForRenderCycle();

            // Assert
            expect(userMessage).toEqual('How is the weather today?');
            expect(conversationHistoryInPreProcessor).toEqual([
                {
                    role: 'user',
                    message: 'Hello AI',
                },
                {
                    role: 'assistant',
                    message: 'Hi user',
                },
            ]);
        });
    });

    describe('With batch adapter', () => {
        it('Should receive the entire conversation history', async () => {
            // Arrange
            let conversationHistoryInPreProcessor: any;
            let userMessage: any;

            const adapter = createChatAdapter()
                .withUrl('http://localhost:8080')
                .withDataTransferMode('batch')
                .withInputPreProcessor((
                    input,
                    conversationHistory,
                ) => {
                    userMessage = input;
                    conversationHistoryInPreProcessor = conversationHistory;
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

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'How is the weather today?{enter}');
            await waitForRenderCycle();

            // Assert
            expect(userMessage).toEqual('How is the weather today?');
            expect(conversationHistoryInPreProcessor).toEqual([
                {
                    role: 'user',
                    message: 'Hello AI',
                },
                {
                    role: 'assistant',
                    message: 'Hi user',
                },
            ]);
        });
    });
});
