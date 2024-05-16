import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + events + ready', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
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

    describe('When the component is rendered', () => {
        it('It should trigger the ready event', async () => {
            // Arrange
            const readyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('ready', readyCallback);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            expect(readyCallback).toHaveBeenCalledOnce();
        });

        it('It should trigger the ready event with the correct details', async () => {
            // Arrange
            const readyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('ready', readyCallback)
                .withClassName('test-class')
                .withInitialConversation([
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi'},
                ])
                .withDisplayOptions({
                    width: '100%',
                    height: 800,
                });

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            expect(readyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    displayOptions: {
                        width: '100%',
                        height: 800,
                    },
                    initialConversation: [
                        {role: 'user', message: 'Hello'},
                        {role: 'ai', message: 'Hi'},
                    ],
                },
            });
        });
    });

    describe('When the component is rendered without a ready event callback', () => {
        describe('When the ready callback is provided after the component is rendered', () => {
            it('It should not trigger the ready event', async () => {
                // Arrange
                const readyCallback = vi.fn();
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.on('ready', readyCallback);

                // Assert
                expect(readyCallback).not.toHaveBeenCalled();
            });
        });
    });
});
