import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + conversationOptions + layout', () => {
    let adapterController: AdapterController | undefined;
    let aiChat: AiChat | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        adapterController = adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
        adapterController = undefined;
    });

    describe('When the user adds a message to an AiChat without layout config', () => {
        it('The default layout used to should be list layout', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
        });
    });

    describe('When the user adds a message to an AiChat with bubbles layout config', () => {
        it('The layout used should be bubbles layout', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withConversationOptions({
                layout: 'bubbles',
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
        });

        describe('When the layout message changes to list layout', () => {
            it('The layout used should be list layout after initial render', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withConversationOptions({
                    layout: 'bubbles',
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello AI!{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const humanMessage: HTMLTextAreaElement = rootElement.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);

                // Act
                aiChat.updateProps({conversationOptions: {layout: 'list'}});
                await waitForRenderCycle();

                // Assert
                expect(humanMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
            });
        });
    });

    describe('When the user adds a message to an AiChat with list layout config', () => {
        it('The layout used should be list layout', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withConversationOptions({
                layout: 'list',
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForRenderCycle();

            // Assert
            const humanMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
            const aiMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

            expect(humanMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
            expect(aiMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
        });

        describe('When the layout message changes to bubbles layout', () => {
            it('The layout should be updated to bubbles layout', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withConversationOptions({
                    layout: 'list',
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello AI!{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const humanMessage: HTMLTextAreaElement = rootElement.querySelector(
                    '.nlux-comp-chatItem.nlux-comp-chatItem--sent')!;
                const aiMessage: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem.nlux-comp-chatItem--received')!;

                expect(humanMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);

                // Act
                aiChat.updateProps({conversationOptions: {layout: 'bubbles'}});
                await waitForRenderCycle();

                // Assert
                expect(humanMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
                expect(aiMessage.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
            });
        });
    });

    describe('When the user adds a message with list layout and without persona config', () => {
        it('The assistant name should be "AI"', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withConversationOptions({
                layout: 'list',
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello AI!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi there!');
            await waitForRenderCycle();

            // Assert
            const assistantName: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-chatItem-participantName')!;
            expect(assistantName.textContent).toBe('Assistant');
        });
    });
});
