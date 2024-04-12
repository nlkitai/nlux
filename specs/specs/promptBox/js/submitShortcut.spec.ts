import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox + submitShortcut', () => {
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

    describe('When no submitShortcut option is initially provided', () => {
        it('The prompt should be submitted when the user presses the Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        describe('When submitShortcut option is set to CommandEnter after initial render', () => {
            it('The prompt should not be submitted when the user presses the Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'CommandEnter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });
        });
    });

    describe('When submitShortcut option is initially set to CommandEnter', () => {
        it('The prompt should not be submitted when the user presses the Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                submitShortcut: 'CommandEnter',
            });
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        describe('When submitShortcut option is set to Enter after initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: 'Enter',
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });
        });

        describe('When submitShortcut option is removed after the initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    submitShortcut: 'CommandEnter',
                });
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();
                aiChat.updateProps({
                    promptBoxOptions: {
                        submitShortcut: undefined,
                    },
                });

                await waitForRenderCycle();

                // When
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });
        });
    });
});
