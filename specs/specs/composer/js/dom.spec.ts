import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the component is created', () => {
        it('The composer should be rendered', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const composer = rootElement.querySelector('.nlux-comp-composer');

            // Assert
            expect(composer).not.toBeFalsy();
        });

        it('The composer should contain text area', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea = rootElement.querySelector('.nlux-comp-composer > textarea');

            // Assert
            expect(textArea).not.toBeFalsy();
        });

        it('The composer should contain send button', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const sendButton = rootElement.querySelector('.nlux-comp-composer > button');

            // Assert
            expect(sendButton).not.toBeFalsy();
        });

        it('The send button should be disabled by default', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const sendButton = rootElement.querySelector('.nlux-comp-composer > button');

            // Assert
            expect(sendButton).toHaveAttribute('disabled');
        });

        describe('When the user types a message', () => {
            it('The send button should be enabled', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Assert
                const sendButton = rootElement.querySelector('.nlux-comp-composer > button');
                expect(sendButton).not.toHaveAttribute('disabled');
            });
        });
    });
});
