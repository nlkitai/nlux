import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + conversationOptions + showWelcomeMessage', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When showWelcomeMessage is not set', () => {
        describe('When no assistant persona is provided', () => {
            it('The NLUX logo should be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} />;

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const logoContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                expect(logoContainer).toBeInTheDocument();
                expect(logoContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avtr_img" style="background-image: url(data:image/png;base64,'),
                );
            });

            describe('When assistant persona is set after the chat is rendered', () => {
                it('The assistant persona should be displayed as the welcome message', async () => {
                    // Arrange
                    const aiChat = <AiChat adapter={adapterController!.adapter} />;

                    // Act
                    const {container, rerender} = render(aiChat);
                    await waitForReactRenderCycle();

                    rerender(<AiChat adapter={adapterController!.adapter} personaOptions={{
                        assistant: {
                            name: 'Assistant',
                            avatar: 'https://example.com/avatar.png',
                        }
                    }} />);
                    await waitForReactRenderCycle();

                    // Assert
                    // Assert
                    const assistantPersonaContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                    expect(assistantPersonaContainer).toBeInTheDocument();
                    expect(assistantPersonaContainer!.innerHTML).toEqual(
                        expect.stringContaining('<div class="avtr_img" style="background-image: url(https://example.com/avatar.png)'),
                    );
                });
            });
        });

        describe('When showWelcomeMessage is set to false after the chat is rendered', () => {
            it('The NLUX logo should not be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} />;

                // Act
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: false
                }} />);
                await waitForReactRenderCycle();

                // Assert
                const logoContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                expect(logoContainer).not.toBeInTheDocument();
            });

            it('The assistant persona should not be displayed as the welcome message', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} personaOptions={{
                    assistant: {
                        name: 'Assistant',
                        avatar: 'https://example.com/avatar.png',
                    }
                }} />;

                // Act
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: false
                }} personaOptions={{
                    assistant: {
                        name: 'Assistant',
                        avatar: 'https://example.com/avatar.png',
                    }
                }} />);
                await waitForReactRenderCycle();

                // Assert
                const assistantPersonaContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                expect(assistantPersonaContainer).not.toBeInTheDocument();
            });
        });
    });

    describe('When showWelcomeMessage is set to false', () => {
        it('The NLUX logo should not be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                showWelcomeMessage: false
            }} />;

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const logoContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
            expect(logoContainer).not.toBeInTheDocument();
        });

        it('The assistant persona should not be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                showWelcomeMessage: false
            }} personaOptions={{
                assistant: {
                    name: 'Assistant',
                    avatar: 'https://example.com/avatar.png',
                }
            }} />;

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const assistantPersonaContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
            expect(assistantPersonaContainer).not.toBeInTheDocument();
        });

        describe('When showWelcomeMessage is set to true after the chat is rendered', () => {
            it('The assistant persona should be displayed', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: false
                }} />;

                // Act
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: true
                }} personaOptions={{
                    assistant: {
                        name: 'Assistant',
                        avatar: 'https://example.com/avatar.png',
                    }
                }} />);
                await waitForReactRenderCycle();

                // Assert
                const assistantPersonaContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                expect(assistantPersonaContainer).toBeInTheDocument();
                expect(assistantPersonaContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avtr_img" style="background-image: url(https://example.com/avatar.png)'),
                );
            });

            it('The NLUX logo should be displayed if no assistant persona is provided', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: false
                }} />;

                // Act
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                rerender(<AiChat adapter={adapterController!.adapter} conversationOptions={{
                    showWelcomeMessage: true
                }} />);
                await waitForReactRenderCycle();

                // Assert
                const logoContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
                expect(logoContainer).toBeInTheDocument();
                expect(logoContainer!.innerHTML).toEqual(
                    expect.stringContaining('<div class="avtr_img" style="background-image: url(data:image/png;base64,'),
                );
            });
        });
    });

    describe('When showWelcomeMessage is set to true', () => {
        it('The assistant persona should be displayed as the welcome message', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                showWelcomeMessage: true
            }} personaOptions={{
                assistant: {
                    name: 'Assistant',
                    avatar: 'https://example.com/avatar.png',
                }
            }} />;

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const assistantPersonaContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
            expect(assistantPersonaContainer).toBeInTheDocument();
            expect(assistantPersonaContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avtr_img" style="background-image: url(https://example.com/avatar.png)'),
            );
        });

        it('The NLUX logo should be displayed if no assistant persona is provided', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} conversationOptions={{
                showWelcomeMessage: true
            }} />;

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const logoContainer = container.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
            expect(logoContainer).toBeInTheDocument();
            expect(logoContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avtr_img" style="background-image: url(data:image/png;base64,'),
            );
        });
    });
});
