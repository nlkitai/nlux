import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + personaOptions + assistant', () => {
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

    describe('When no assistant persona is set', () => {
        it('The NLUX logo should be rendered as welcome message', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;

            // Act
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            const logoContainer = container.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
            expect(logoContainer).toBeInTheDocument();
            expect(logoContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avatarPicture" style="background-image: url(data:image/png;base64,'),
            );
        });

        describe('When the assistant persona is set after initial render', () => {
            it('Assistant persona details should be rendered instead of the NLUX logo', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter}/>;

                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'AI Assistant',
                            avatar: 'https://assistant-image-url',
                        },
                    }}
                />);
                await waitForReactRenderCycle();

                // Assert
                const avatarContainer = container.querySelector('.nlux-comp-welcomeMessage > .nlux-comp-avatar > .avatarContainer');
                expect(avatarContainer).toBeInTheDocument();
                expect(avatarContainer!.querySelector('.avatarPicture')).toHaveStyle(
                    'background-image: url(https://assistant-image-url)',
                );
            });
        });
    });

    describe('When the assistant persona is set with image URL and name', () => {
        describe('When the user sends a message', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Persona photo should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'AI Assistant',
                            avatar: 'https://assistant-image-url',
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer > .avatarPicture';
                const avatarImage = container.querySelector(selector) as HTMLElement | null;
                expect(avatarImage).toBeInTheDocument();
                expect(avatarImage!.style.backgroundImage).toBe('url(https://assistant-image-url)');
            });
        });

        describe('When the avatar is updated', () => {
            it('Should update the user persona photo', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'Mr Assistant',
                            avatar: 'https://assistant-image-url',
                        },
                    }}
                />;

                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController!.resolve('Hi, how can I help you?');
                await waitForReactRenderCycle();

                await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
                await waitForReactRenderCycle();

                adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'X-Assistant',
                            avatar: 'https://xbot-image-url',
                        },
                    }}
                />);

                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer > .avatarPicture';
                const avatarImageContainer = container.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://xbot-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://xbot-image-url)');
            });
        });
    });

    describe('When the assistant persona is set with JSX as element', () => {
        describe('When the assistant sends a response', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'Mr Assistant',
                            avatar: <div id="jsx-avatar">JSX Avatar</div>,
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > #jsx-avatar';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Assistant persona JSX should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        assistant: {
                            name: 'Mr Assistant',
                            avatar: <div id="jsx-avatar">JSX Avatar</div>,
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--received > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > #jsx-avatar';
                const avatarJsxContainer = container.querySelector(selector);
                expect(avatarJsxContainer).toBeInTheDocument();
                expect(avatarJsxContainer).toHaveTextContent('JSX Avatar');
            });
        });
    });
});
