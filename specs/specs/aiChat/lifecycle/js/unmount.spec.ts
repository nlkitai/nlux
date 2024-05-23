import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + event lifecycle', () => {
    let adapterController: AdapterController | undefined = undefined;4
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the component is unmounted', async () => {
        it('Should remove the chat component from the DOM', async () => {
            // Arrange
            adapterController = adapterBuilder().withBatchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            const aiChatElement = rootElement.querySelector('.nlux-AiChat-root');
            expect(aiChatElement).not.toBeInTheDocument();
        });

        it('Should change the status to "unmounted"', async () => {
            // Arrange
            adapterController = adapterBuilder().withBatchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(aiChat.status).toBe('unmounted');
        });

        describe('When mount is called after unmount', () => {
            it('Should throw an error', async () => {
                // Arrange
                adapterController = adapterBuilder().withBatchText().create();
                aiChat = createAiChat().withAdapter(adapterController.adapter);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                aiChat.unmount();
                await waitForRenderCycle();

                // Assert
                expect(() => aiChat!.mount(rootElement)).toThrowError();
            });

            it('Should not change the status', async () => {
                // Arrange
                adapterController = adapterBuilder().withBatchText().create();
                aiChat = createAiChat().withAdapter(adapterController.adapter);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                aiChat.unmount();
                await waitForRenderCycle();

                // Assert
                expect(aiChat.status).toBe('unmounted');
            });

            it('No more event listeners can be added', async () => {
                // Arrange
                adapterController = adapterBuilder().withBatchText().create();
                aiChat = createAiChat().withAdapter(adapterController.adapter);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                aiChat.unmount();
                await waitForRenderCycle();

                // Assert
                expect(() => aiChat!.on('messageReceived', () => {})).toThrowError();
            });
        });
    });
});
