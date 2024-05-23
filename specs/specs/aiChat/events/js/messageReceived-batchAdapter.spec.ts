import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + batch adapter + events + messageReceived', () => {
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

    describe('When a message is received', () => {
        it('It should trigger the messageReceived event', async () => {
            // Arrange
            const messageReceivedCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('messageReceived', messageReceivedCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            expect(messageReceivedCallback).toHaveBeenCalledOnce();
        });
    });

    describe('When the callback updates between messages', () => {
        it('It should trigger the messageReceived event with the new callback', async () => {
            // Arrange
            const messageReceivedCallback1 = vi.fn();
            const messageReceivedCallback2 = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('messageReceived', messageReceivedCallback1);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');

            // Act
            adapterController!.resolve('Yo!');
            await waitForMdStreamToComplete();

            // Assert
            expect(messageReceivedCallback1).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Yo!',
            });

            // Arrange
            aiChat.removeEventListener('messageReceived', messageReceivedCallback1);
            aiChat.on('messageReceived', messageReceivedCallback2);

            // Act
            await userEvent.type(textArea, 'Bonjour{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Salut!');
            await waitForRenderCycle();

            // Assert
            expect(messageReceivedCallback1).toHaveBeenCalledOnce();
            expect(messageReceivedCallback2).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Salut!',
            });
        });
    });
});
