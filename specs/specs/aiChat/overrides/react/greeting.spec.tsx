import {AiChat, AiChatUI} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + UI overrides + greeting', () => {
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

    describe('A UI override for the greeting message is provided', () => {
        it('Should show the user-provided greeting message', async () => {
            // Arrange
            const aiChat = (
                <AiChat adapter={adapterController!.adapter}>
                    <AiChatUI.Greeting>
                        <div className="custom-loader">Hellouuuuh 👻</div>
                    </AiChatUI.Greeting>
                </AiChat>
            );

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const greeting = container.querySelector('.nlux-comp-welcomeMessage') as HTMLDivElement | undefined;
            expect(greeting).toBeInTheDocument();
            expect(greeting!.textContent).toBe('Hellouuuuh 👻');
        });

        describe('When the user-provided greeting changes', () => {
            it('Should show the new greeting', async () => {
                // Arrange
                const aiChat = (
                    <AiChat adapter={adapterController!.adapter}>
                        <AiChatUI.Greeting>
                            <div className="custom-loader">Custom Greeting 1</div>
                        </AiChatUI.Greeting>
                    </AiChat>
                );

                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter}>
                        <AiChatUI.Greeting>
                            <div className="custom-loader">Custom Greeting 2</div>
                        </AiChatUI.Greeting>
                    </AiChat>,
                );
                await waitForReactRenderCycle();

                // Assert
                const greeting = container.querySelector('.nlux-comp-welcomeMessage') as HTMLDivElement | undefined;
                expect(greeting).toBeInTheDocument();
                expect(greeting!.textContent).toBe('Custom Greeting 2');
            });
        });

        describe('When the showWelcomeMessage option is set to false', () => {
            it('Should not show the user greeting', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        conversationOptions={{
                            showWelcomeMessage: false,
                        }}
                    >
                        <AiChatUI.Greeting>
                            <div className="custom-greeting">Custom Greeting</div>
                        </AiChatUI.Greeting>
                    </AiChat>
                );

                // Act
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const greeting = container.querySelector('.nlux-comp-welcomeMessage') as HTMLDivElement | undefined;
                const customGreeting = container.querySelector('.custom-greeting') as HTMLDivElement | undefined;
                expect(greeting).toBeEmpty();
                expect(customGreeting).not.toBeInTheDocument();
            });
        });

        describe('When persona options and custom greeting override are provided', () => {
            it('Should show the custom greeting override', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        personaOptions={{
                            assistant: {
                                name: 'HarryBotter',
                                avatar: 'https://example.com/avatar.jpg',
                                tagline: 'Making Magic With Mirthful AI',
                            },
                        }}
                    >
                        <AiChatUI.Greeting>
                            <div className="custom-greeting">Custom Greeting</div>
                        </AiChatUI.Greeting>
                    </AiChat>
                );

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const greeting = container.querySelector('.nlux-comp-welcomeMessage') as HTMLDivElement | undefined;
                const customGreeting = container.querySelector('.custom-greeting') as HTMLDivElement | undefined;
                expect(greeting).toContainHTML('Custom Greeting');
                expect(greeting).not.toContainHTML('HarryBotter');
                expect(customGreeting).toBeInTheDocument();
            });
        });
    });
});
