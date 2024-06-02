import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + conversationOptions + showWelcomeMessage', () => {
    let adapterController: AdapterController | undefined;
    let aiChat: AiChat | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        adapterController = adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
        adapterController = undefined;
    });

    describe('When showWelcomeMessage is not set', () => {
        describe('When no assistant persona is provided', () => {
            it('The NLUX logo should be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Assert
                const logoContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(logoContainer).toBeInTheDocument();
                expect(logoContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avatarPicture" style="background-image: url(data:image/png;base64,'),
                );
            });

            describe('When assistant persona is set after the chat is rendered', () => {
                it('The assistant persona should be displayed as the welcome message', async () => {
                    // Arrange
                    const aiChat = createAiChat()
                        .withAdapter(adapterController!.adapter);

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    // Act
                    aiChat.updateProps({
                        personaOptions: {
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/avatar.png',
                            },
                        },
                    });
                    await waitForRenderCycle();

                    // Assert
                    const assistantPersonaContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                    expect(assistantPersonaContainer).toBeInTheDocument();
                    expect(assistantPersonaContainer!.innerHTML).toEqual(
                        expect.stringContaining('<div class="avatarPicture" style="background-image: url(https://example.com/avatar.png)'),
                    );
                });
            });
        });

        describe('When showWelcomeMessage is set to false after the chat is rendered', () => {
            it('The NLUX logo should not be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    conversationOptions: {
                        showWelcomeMessage: false,
                    },
                });
                await waitForRenderCycle();

                // Assert
                const logoContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(logoContainer).not.toBeInTheDocument();
            });

            it('The assistant persona should not be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant',
                            avatar: 'https://example.com/avatar.png',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    conversationOptions: {
                        showWelcomeMessage: false,
                    },
                });
                await waitForRenderCycle();

                // Assert
                const assistantPersonaContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(assistantPersonaContainer).not.toBeInTheDocument();
            });
        });
    });

    describe('When showWelcomeMessage is set to false', () => {
        it('The NLUX logo should not be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withConversationOptions({
                    showWelcomeMessage: false,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const welcomeMessageContainer = rootElement.querySelector('.nlux-comp-welcomeMessage');
            userEvent.click(welcomeMessageContainer!);

            // Assert
            const logoContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
            expect(logoContainer).not.toBeInTheDocument();
        });

        it('The assistant persona should not be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withConversationOptions({
                    showWelcomeMessage: false,
                })
                .withPersonaOptions({
                    assistant: {
                        name: 'Assistant',
                        avatar: 'https://example.com/avatar.png',
                    },
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const welcomeMessageContainer = rootElement.querySelector('.nlux-comp-welcomeMessage');
            userEvent.click(welcomeMessageContainer!);

            // Assert
            const assistantPersonaContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
            expect(assistantPersonaContainer).not.toBeInTheDocument();
        });

        describe('When showWelcomeMessage is set to true after the chat is rendered', () => {
            it('The assistant persona should be displayed', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withConversationOptions({
                        showWelcomeMessage: false,
                    })
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant',
                            avatar: 'https://example.com/avatar.png',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    conversationOptions: {
                        showWelcomeMessage: true,
                    },
                });
                await waitForRenderCycle();

                // Assert
                const assistantPersonaContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(assistantPersonaContainer).toBeInTheDocument();
                expect(assistantPersonaContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avatarPicture" style="background-image: url(https://example.com/avatar.png)'),
                );
            });

            it('The NLUX logo should be displayed if no assistant persona is provided', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withConversationOptions({
                        showWelcomeMessage: false,
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    conversationOptions: {
                        showWelcomeMessage: true,
                    },
                });
                await waitForRenderCycle();

                // Assert
                const logoContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(logoContainer).toBeInTheDocument();
                expect(logoContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avatarPicture" style="background-image: url(data:image/png;base64,'),
                );
            });
        });
    });

    describe('When showWelcomeMessage is set to true', () => {
        it('The assistant persona should be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withConversationOptions({
                    showWelcomeMessage: true,
                })
                .withPersonaOptions({
                    assistant: {
                        name: 'Assistant',
                        avatar: 'https://example.com/avatar.png',
                    },
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const assistantPersonaContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
            expect(assistantPersonaContainer).toBeInTheDocument();
            expect(assistantPersonaContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avatarPicture" style="background-image: url(https://example.com/avatar.png)'),
            );
        });

        it('The NLUX logo should be displayed if no assistant persona is provided', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withConversationOptions({
                    showWelcomeMessage: true,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const logoContainer = rootElement.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
            expect(logoContainer).toBeInTheDocument();
            expect(logoContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avatarPicture" style="background-image: url(data:image/png;base64,'),
            );
        });
    });
});
