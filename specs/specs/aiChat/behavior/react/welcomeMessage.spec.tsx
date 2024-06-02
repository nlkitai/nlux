import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + assistant persona + welcome message', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When assistant persona is configured and a tagline is provided', () => {
        describe('When no initial conversation is provided', () => {
            it('The welcome message should be displayed', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        personaOptions={{
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/assistant.png',
                                tagline: 'Welcome to the chat',
                            },
                        }}
                    />
                );
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                const welcomeMessage = container.querySelector('.nlux-comp-welcomeMessage')!;
                expect(welcomeMessage).not.toBeNull();
                expect(welcomeMessage.textContent).toContain('Welcome to the chat');
            });

            describe('When the user submits a message', () => {
                it('The welcome message should be removed', async () => {
                    // Arrange
                    const aiChat = (
                        <AiChat
                            adapter={adapterController!.adapter}
                            personaOptions={{
                                assistant: {
                                    name: 'Assistant',
                                    avatar: 'https://example.com/assistant.png',
                                    tagline: 'Welcome to the chat',
                                },
                            }}
                        />
                    );
                    const {container} = render(aiChat);
                    await waitForReactRenderCycle();

                    await waitForReactRenderCycle();
                    const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                    // Act
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForReactRenderCycle();

                    // Assert
                    const welcomeMessage = container.querySelector('.nlux-comp-welcomeMessage');
                    expect(welcomeMessage).toBeNull();
                });
            });

            describe('When the initial message submission fails', () => {
                it('The welcome message should be displayed again', async () => {
                    // Arrange
                    const aiChat = (
                        <AiChat
                            adapter={adapterController!.adapter}
                            personaOptions={{
                                assistant: {
                                    name: 'Assistant',
                                    avatar: 'https://example.com/assistant.png',
                                    tagline: 'Welcome to the chat',
                                },
                            }}
                        />
                    );
                    const {container} = render(aiChat);
                    await waitForReactRenderCycle();

                    await waitForReactRenderCycle();
                    const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                    // Act
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForReactRenderCycle();

                    adapterController!.reject('Sorry user!');
                    await waitForReactRenderCycle();

                    // Assert
                    const welcomeMessage = container.querySelector('.nlux-comp-welcomeMessage')!;
                    expect(welcomeMessage).not.toBeNull();
                    expect(welcomeMessage.textContent).toContain('Welcome to the chat');
                });
            });
        });

        describe('When an initial conversation is provided', () => {
            it('The welcome message should not be displayed', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        personaOptions={{
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/assistant.png',
                                tagline: 'Welcome to the chat',
                            },
                        }}
                        initialConversation={[
                            {
                                role: 'assistant',
                                message: 'Hello, world!',
                            },
                            {
                                role: 'user',
                                message: 'Hi, assistant!',
                            },
                        ]}
                    />
                );

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const welcomeMessage = container.querySelector('.nlux-comp-welcomeMessage');
                expect(welcomeMessage).toBeNull();
            });
        });
    });
});
