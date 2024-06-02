import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer + submitShortcut', () => {
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

    describe('When no submitShortcut option is initially provided', () => {
        it('The prompt should be submitted when the user presses the Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should not be submitted when the textarea is empty and the user presses the Enter key',
            async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();


                // Act
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            },
        );

        it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        describe('When submitShortcut option is set to CommandEnter after initial render', () => {
            it('The prompt should not be submitted when the user presses the Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });
        });
    });

    describe('When submitShortcut option is initially set to CommandEnter', () => {
        it('The prompt should not be submitted when the user presses the Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        describe('When submitShortcut option is set to Enter after initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });
        });

        describe('When submitShortcut option is removed after the initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    composerOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });
        });
    });
});
