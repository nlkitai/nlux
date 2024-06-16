import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + displayOptions + colorScheme', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    let matchMedia: Mock;
    let matchMediaNative: typeof window.matchMedia;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        matchMedia = vi.fn(() => ({matches: true}));
        matchMediaNative = window.matchMedia;
        (window as unknown as Record<string, unknown>).matchMedia = matchMedia;
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        (window as unknown as Record<string, unknown>).matchMedia = matchMediaNative;
    });

    describe('When the component is created without a color scheme option', () => {
        describe('When the system default color scheme is light', () => {
            it('The system default light theme scheme should be used', async () => {
                // Arrange
                matchMedia.mockReturnValue({matches: false});
                aiChat = createAiChat().withAdapter(adapterController!.adapter);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

                // Assert
                expect(aiChatDom.dataset.colorScheme).toContain('light');
            });
        });

        describe('When the system default color scheme is dark', () => {
            it('The system default dark theme scheme should be used', async () => {
                // Arrange
                matchMedia.mockReturnValue({matches: true});
                aiChat = createAiChat().withAdapter(adapterController!.adapter);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

                // Assert
                expect(aiChatDom.dataset.colorScheme).toContain('dark');
            });
        });
    });

    describe('When a color scheme option is set to light', () => {
        it('The light theme scheme should be used', async () => {
            // Arrange
            matchMedia.mockReturnValue({matches: true}); // System default is dark

            // Act
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withDisplayOptions({
                    colorScheme: 'light',
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

            // Assert
            expect(aiChatDom.dataset.colorScheme).toContain('light');
        });

        describe('When the color scheme is updated after the component is created', () => {
            it('The new color scheme should be used', async () => {
                // Arrange
                matchMedia.mockReturnValue({matches: true}); // System default is dark
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withDisplayOptions({
                        colorScheme: 'light',
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    displayOptions: {
                        colorScheme: 'dark',
                    },
                });
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

                // Assert
                expect(aiChatDom.dataset.colorScheme).toContain('dark');
            });
        });
    });

    describe('When a color scheme option is unset after the component is created', () => {
        it('The system default color scheme should be used', async () => {
            // Arrange
            matchMedia.mockReturnValue({matches: true}); // System default is dark
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withDisplayOptions({
                    colorScheme: 'light',
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.updateProps({
                displayOptions: {
                    colorScheme: undefined,
                },
            });
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

            // Assert
            expect(aiChatDom.dataset.colorScheme).toContain('dark');
        });
    });

    describe('When the displayOptions are unset after the component is created', () => {
        it('The system default color scheme should be used', async () => {
            // Arrange
            matchMedia.mockReturnValue({matches: true}); // System default is dark
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withDisplayOptions({
                    colorScheme: 'light',
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.updateProps({
                displayOptions: undefined,
            });
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

            // Assert
            expect(aiChatDom.dataset.colorScheme).toContain('dark');
        });
    });

    describe('When a color scheme option is set to dark', () => {
        it('The dark theme scheme should be used', async () => {
            // Arrange
            matchMedia.mockReturnValue({matches: false}); // System default is light

            // Act
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withDisplayOptions({
                    colorScheme: 'dark',
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root') as HTMLDivElement;

            // Assert
            expect(aiChatDom.dataset.colorScheme).toContain('dark');
        });
    });
});
