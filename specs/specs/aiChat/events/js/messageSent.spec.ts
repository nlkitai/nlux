import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + events + messageSent', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When a message is sent', () => {
        it('It should trigger the messageSent event', async () => {
            // Arrange
            const messageSentCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('messageSent', messageSentCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(messageSentCallback).toHaveBeenCalledOnce();
        });

        it('It should pass the message to the event handler', async () => {
            // Arrange
            const messageSentCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('messageSent', messageSentCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(messageSentCallback).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Hello',
            });
        });
    });

    describe('When the event handler is updated', () => {
        it('It should trigger the new event handler', async () => {
            // Arrange
            const messageSentCallback1 = vi.fn();
            const messageSentCallback2 = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('messageSent', messageSentCallback1);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hello');
            await waitForRenderCycle();

            // Act
            aiChat.removeEventListener('messageSent', messageSentCallback1);
            aiChat.on('messageSent', messageSentCallback2);

            await userEvent.type(textArea, 'Bonjour{enter}');
            await waitForRenderCycle();

            // Assert
            expect(messageSentCallback1).toHaveBeenCalledOnce();
            expect(messageSentCallback1).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Hello',
            });

            expect(messageSentCallback2).toHaveBeenCalledOnce();
            expect(messageSentCallback2).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Bonjour',
            });
        });
    });
});
