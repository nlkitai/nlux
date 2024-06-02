import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter()', () => {
    let adapterController: AdapterController;
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

    describe('When the custom adapter provided implements both batchText and streamText methods', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(true)
                .withStreamText(true)
                .create();
        });

        it('streamText should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController.streamTextMock).toHaveBeenCalledWith('Hello', expect.anything());
            expect(adapterController.batchTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements only the batchText method', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(true)
                .withStreamText(false)
                .create();
        });

        it('batchText should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            expect(adapterController.batchTextMock).toHaveBeenCalledWith('Hello');
            expect(adapterController.streamTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements only the streamText method', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(false)
                .withStreamText(true)
                .create();
        });

        it('streamText should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController.streamTextMock).toHaveBeenCalledWith('Hello', expect.anything());
            expect(adapterController.batchTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements none of the fetch/streamText methods', () => {
        beforeEach(() => {
            adapterController = adapterBuilder().create();
        });

        it('An error should be thrown', () => {
            expect(() => createAiChat().withAdapter(adapterController.adapter)).toThrowError();
        });
    });

    describe('When no adapter is provided', () => {
        it('An error should be thrown', () => {
            aiChat = createAiChat();
            expect(() => aiChat.mount(rootElement)).toThrowError();
        });
    });

    describe('When an invalid object is provided as an adapter', () => {
        it('An error should be thrown as soon as the adapter is set', () => {
            expect(() => createAiChat().withAdapter(undefined as any)).toThrowError();
            expect(() => createAiChat().withAdapter(null as any)).toThrowError();
            expect(() => createAiChat().withAdapter(123 as any)).toThrowError();
            expect(() => createAiChat().withAdapter('' as any)).toThrowError();
        });
    });
});
