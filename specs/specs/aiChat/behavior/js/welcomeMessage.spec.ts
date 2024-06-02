import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + assistant persona + welcome message', () => {
    let adapterController: AdapterController | undefined = undefined;

    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When assistant persona is configured and a tagline is provided', () => {
        describe('When no initial conversation is provided', () => {
            it('The welcome message should be displayed', async () => {
                // Arrange
                adapterController = adapterBuilder().withBatchText().create();
                aiChat = createAiChat()
                    .withAdapter(adapterController.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant',
                            avatar: 'https://example.com/assistant.png',
                            tagline: 'Welcome to the chat',
                        },
                    });

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Assert
                const welcomeMessage = rootElement.querySelector('.nlux-comp-welcomeMessage')!;
                expect(welcomeMessage).not.toBeNull();
                expect(welcomeMessage.textContent).toContain('Welcome to the chat');
            });

            describe('When the user submits a message', () => {
                it('The welcome message should be removed', async () => {
                    // Arrange
                    adapterController = adapterBuilder().withBatchText().create();
                    aiChat = createAiChat()
                        .withAdapter(adapterController.adapter)
                        .withPersonaOptions({
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/assistant.png',
                                tagline: 'Welcome to the chat',
                            },
                        });

                    // Act
                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    // Assert
                    const welcomeMessage = rootElement.querySelector('.nlux-comp-welcomeMessage');
                    expect(welcomeMessage).toBeNull();
                });
            });

            describe('When the initial message submission fails', () => {
                it('The welcome message should be displayed again', async () => {
                    // Arrange
                    adapterController = adapterBuilder().withBatchText().create();
                    aiChat = createAiChat()
                        .withAdapter(adapterController.adapter)
                        .withPersonaOptions({
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/assistant.png',
                                tagline: 'Welcome to the chat',
                            },
                        });

                    // Act
                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    adapterController.reject('Error');
                    await waitForRenderCycle();

                    // Assert
                    const welcomeMessage = rootElement.querySelector('.nlux-comp-welcomeMessage')!;
                    expect(welcomeMessage).not.toBeNull();
                    expect(welcomeMessage.textContent).toContain('Welcome to the chat');
                });
            });
        });

        describe('When an initial conversation is provided', () => {
            it('The welcome message should not be displayed', async () => {
                // Arrange
                adapterController = adapterBuilder().withBatchText().create();
                aiChat = createAiChat()
                    .withAdapter(adapterController.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant',
                            avatar: 'https://example.com/assistant.png',
                            tagline: 'Welcome to the chat',
                        },
                    })
                    .withInitialConversation([
                        {
                            role: 'assistant',
                            message: 'Hello, world!',
                        },
                        {
                            role: 'user',
                            message: 'Hi, assistant!',
                        },
                    ]);

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Assert
                const welcomeMessage = rootElement.querySelector('.nlux-comp-welcomeMessage');
                expect(welcomeMessage).toBeNull();
            });
        });
    });
});
