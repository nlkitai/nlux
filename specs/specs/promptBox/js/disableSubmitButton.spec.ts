import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox + disableSubmitButton', () => {
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

    describe('When no disableSubmitButton option is initially provided', () => {
        it('The submit button should be initially disabled', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

            // Then
            expect(button.getAttribute('disabled')).toBe('');
        });

        describe('When the user types in the text area', () => {
            it('The submit button should be enabled', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

                // When
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Then
                expect(button.getAttribute('disabled')).toBeNull();
            });
        });
    });

    describe('When disableSubmitButton option is initially set to true', () => {
        it('The submit button should be initially disabled', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                disableSubmitButton: true,
            });

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

            // Then
            expect(button.getAttribute('disabled')).toBe('');
        });

        describe('When the user types in the text area', () => {
            it('The submit button should remain disabled', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    disableSubmitButton: true,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

                // When
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Then
                expect(button.getAttribute('disabled')).toBe('');
            });

            describe('When disableSubmitButton option is set to false', () => {
                it('The submit button should be enabled', async () => {
                    // Given
                    aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                        disableSubmitButton: true,
                    });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
                    await userEvent.type(textArea, 'Hi');
                    await waitForRenderCycle();

                    // When
                    aiChat.updateProps({
                        promptBoxOptions: {
                            disableSubmitButton: false,
                        },
                    });

                    await waitForRenderCycle();

                    // Then
                    expect(button.getAttribute('disabled')).toBeNull();
                });
            });
        });
    });

    describe('When disableSubmitButton option is initially set to false', () => {
        it('The submit button should be initially enabled', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                disableSubmitButton: false,
            });

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

            // Then
            expect(button.getAttribute('disabled')).toBeNull();
        });

        describe('When the user types in the text area', () => {
            it('The submit button should remain enabled', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    disableSubmitButton: false,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;

                // When
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // Then
                expect(button.getAttribute('disabled')).toBeNull();
            });

            describe('When disableSubmitButton option is set to true', () => {
                it('The submit button should be disabled', async () => {
                    // Given
                    aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                        disableSubmitButton: false,
                    });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
                    await userEvent.type(textArea, 'Hi');
                    await waitForRenderCycle();

                    // When
                    aiChat.updateProps({
                        promptBoxOptions: {
                            disableSubmitButton: true,
                        },
                    });

                    await waitForRenderCycle();

                    // Then
                    expect(button.getAttribute('disabled')).toBe('');
                });
            });
        });

        describe('When the user submits a message', () => {
            it('The submit button should be disabled', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({
                    disableSubmitButton: false,
                });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                const button = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
                await userEvent.type(textArea, 'Hello');
                await waitForRenderCycle();

                // When
                await userEvent.click(button);
                await waitForRenderCycle();

                // Then
                expect(button.getAttribute('disabled')).toBe('');
            });
        });
    });
});
