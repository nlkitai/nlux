import {createAdapter} from '@nlux-dev/langchain/src';
import {AiChat, createAiChat} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {submit, type} from '../../../utils/userInteractions';
import {waitForRenderCycle} from '../../../utils/wait';

describe('When LangServe input pre-processor is used with streaming adapter', () => {
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

    it('should receive the entire conversation history', async () => {
        let conversationHistoryInPreProcessor: any;
        let userMessage: any;

        const adapter = createAdapter()
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
                    role: 'ai',
                    message: 'Hi user',
                },
            ]);

        aiChat.mount(rootElement);

        await waitForRenderCycle();
        await type('How is the weather today?');
        await submit();
        await waitForRenderCycle();

        expect(userMessage).toEqual('How is the weather today?');
        expect(conversationHistoryInPreProcessor).toEqual([
            {
                role: 'user',
                message: 'Hello AI',
            },
            {
                role: 'ai',
                message: 'Hi user',
            },
        ]);
    });
});

describe('When LangServe input pre-processor is used with fetch adapter', () => {
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

    it('should receive the entire conversation history', async () => {
        let conversationHistoryInPreProcessor: any;
        let userMessage: any;

        const adapter = createAdapter()
            .withUrl('http://localhost:8080')
            .withDataTransferMode('fetch')
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
                    role: 'ai',
                    message: 'Hi user',
                },
            ]);

        aiChat.mount(rootElement);

        await waitForRenderCycle();
        await type('How is the weather today?');
        await submit();
        await waitForRenderCycle();

        expect(userMessage).toEqual('How is the weather today?');
        expect(conversationHistoryInPreProcessor).toEqual([
            {
                role: 'user',
                message: 'Hello AI',
            },
            {
                role: 'ai',
                message: 'Hi user',
            },
        ]);
    });
});
