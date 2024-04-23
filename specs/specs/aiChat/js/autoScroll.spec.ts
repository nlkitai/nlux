import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + autoScroll', () => {
    let adapterController: AdapterController | undefined;
    let aiChat: AiChat | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        adapterController = adapterController = adapterBuilder()
            .withFetchText(false)
            .withStreamText(true)
            .create();
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
        adapterController = undefined;
    });

    describe('When the user adds a message to an AiChat', () => {
        it('Should scroll to the bottom when the message starts streaming', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const conversationContainer: any = rootElement.querySelector('.nlux-chtRm-cnv-cntr')!;
            conversationContainer.scrollTo = vi.fn();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();
            await waitForMdStreamToComplete();

            // Assert
            expect(conversationContainer?.scrollTo).toHaveBeenCalledWith({behavior: 'instant', top: 50000});
        });

        describe('When a message is being streamed', () => {
            it('Should scroll to the bottom when the message is streamed', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const conversationContainer: any = rootElement.querySelector('.nlux-chtRm-cnv-cntr')!;
                conversationContainer.scrollTo = vi.fn();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();
                await waitForMdStreamToComplete();

                // Assert
                const timesScrollToBottomCalledBeforeNextChunk = (conversationContainer?.scrollTo as any)?.mock.calls.length;
                expect(timesScrollToBottomCalledBeforeNextChunk).toBeGreaterThan(0);

                // Act
                adapterController!.next('Hi\n\n\n\n\nLLM!');
                await waitForMdStreamToComplete(50);

                // Assert
                const timesScrollToBottomCalledAfterNextChunk = (conversationContainer?.scrollTo as any)?.mock.calls.length;
                expect(timesScrollToBottomCalledAfterNextChunk).toBeGreaterThan(
                    timesScrollToBottomCalledBeforeNextChunk);
            });
        });
    });

    describe('When scrollWhenGenerating is set to false', () => {
        it('Should not scroll to the bottom when the message starts streaming', async () => {
            // Arrange
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withConversationOptions({scrollWhenGenerating: false});

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const conversationContainer: any = rootElement.querySelector('.nlux-chtRm-cnv-cntr')!;
            conversationContainer.scrollTo = vi.fn();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();
            await waitForMdStreamToComplete();

            // Assert
            expect(conversationContainer?.scrollTo).not.toHaveBeenCalled();
        });

        describe('When a message is being streamed', () => {
            it('Should not scroll to the bottom when the message is being streamed', async () => {
                // Arrange
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withConversationOptions({scrollWhenGenerating: false});

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const conversationContainer: any = rootElement.querySelector('.nlux-chtRm-cnv-cntr')!;
                conversationContainer.scrollTo = vi.fn();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();
                await waitForMdStreamToComplete();

                // Assert
                const timesScrollToBottomCalledBeforeNextChunk = (conversationContainer?.scrollTo as any)?.mock.calls.length;
                expect(timesScrollToBottomCalledBeforeNextChunk).toBe(0);

                // Act
                adapterController!.next('Hi LLM');
                await waitForMdStreamToComplete(50);

                // Assert
                const timesScrollToBottomCalledAfterNextChunk = (conversationContainer?.scrollTo as any)?.mock.calls.length;
                expect(timesScrollToBottomCalledAfterNextChunk).toBe(0);
            });
        });
    });
});
