import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + displayOptions + themeId', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the component is created without a theme option', () => {
        it('The default theme should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-theme-luna');
        });

        describe('When a theme is set', () => {
            it('The theme should be used', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    displayOptions: {
                        themeId: 'vienna',
                    },
                });
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.className).toContain('nlux-theme-vienna');
            });
        });
    });

    describe('When the component is created with a theme option', () => {
        it('The theme should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({
                themeId: 'aliba',
            });

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-theme-aliba');
        });

        describe('When a different theme is set', () => {
            it('The new theme should be used', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({
                    themeId: 'aliba',
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    displayOptions: {
                        themeId: 'vienna',
                    },
                });

                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.className).toContain('nlux-theme-vienna');
            });
        });

        describe('When the themeId is removed', () => {
            it('The default theme should be used', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({
                    themeId: 'aliba',
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    displayOptions: {
                        themeId: undefined,
                    },
                });

                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.className).toContain('nlux-theme-luna');
            });
        });

        it('When the displayOptions are removed, the default theme should be used', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({
                themeId: 'aliba',
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.updateProps({
                displayOptions: undefined,
            });

            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-theme-luna');
        });
    });
});
