import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer + disableSubmitButton', () => {
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

    describe('When no disableSubmitButton option is initially provided', () => {
        it('The submit button should be initially disabled', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-composer > button')!;

            // Assert
            expect(button.getAttribute('disabled')).toBe('');
        });

        describe('When the user types in the text area', () => {
            it('The submit button should be enabled', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-composer > button')!;

                // Act
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Assert
                expect(button.getAttribute('disabled')).toBeNull();
            });
        });
    });

    describe('When disableSubmitButton option is initially set to true', () => {
        it('The submit button should be initially disabled', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                disableSubmitButton: true,
            });

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-composer > button')!;

            // Assert
            expect(button.getAttribute('disabled')).toBe('');
        });

        describe('When the user types in the text area', () => {
            it('The submit button should remain disabled', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    disableSubmitButton: true,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-composer > button')!;

                // Act
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Assert
                expect(button.getAttribute('disabled')).toBe('');
            });

            describe('When disableSubmitButton option is set to false', () => {
                it('The submit button should be enabled', async () => {
                    // Arrange
                    aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                        disableSubmitButton: true,
                    });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                    const button = rootElement.querySelector('.nlux-comp-composer > button')!;
                    await userEvent.type(textArea, 'Hi');
                    await waitForRenderCycle();

                    // Act
                    aiChat.updateProps({
                        composerOptions: {
                            disableSubmitButton: false,
                        },
                    });

                    await waitForRenderCycle();

                    // Assert
                    expect(button.getAttribute('disabled')).toBeNull();
                });
            });
        });
    });

    describe('When disableSubmitButton option is initially set to false', () => {
        it('The submit button should be initially enabled', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                disableSubmitButton: false,
            });

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-composer > button')!;

            // Assert
            expect(button.getAttribute('disabled')).toBeNull();
        });

        describe('When the user types in the text area', () => {
            it('The submit button should remain enabled', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    disableSubmitButton: false,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-composer > button')!;

                // Act
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Assert
                expect(button.getAttribute('disabled')).toBeNull();
            });

            describe('When disableSubmitButton option is set to true', () => {
                it('The submit button should be disabled', async () => {
                    // Arrange
                    aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                        disableSubmitButton: false,
                    });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                    const button = rootElement.querySelector('.nlux-comp-composer > button')!;
                    await userEvent.type(textArea, 'Hi');
                    await waitForRenderCycle();

                    // Act
                    aiChat.updateProps({
                        composerOptions: {
                            disableSubmitButton: true,
                        },
                    });

                    await waitForRenderCycle();

                    // Assert
                    expect(button.getAttribute('disabled')).toBe('');
                });
            });
        });

        describe('When the user submits a message', () => {
            it('The submit button should be disabled', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({
                    disableSubmitButton: false,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-composer > button')!;
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Act
                await userEvent.click(button);
                await waitForRenderCycle();

                // Assert
                expect(button.getAttribute('disabled')).toBe('');
            });
        });
    });
});
