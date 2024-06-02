import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + personaOptions + user', () => {
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

    describe('When the user persona is set with image URL and name', () => {
        describe('When the user sends a message', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
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

                // Assert
                const selector = '.nlux-comp-chatItem--sent > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Persona photo should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
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

                // Assert
                const selector = '.nlux-comp-chatItem--sent > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer > .avatarPicture';
                const avatarImageContainer = container.querySelector(selector) as HTMLDivElement | null;
                expect(avatarImageContainer).toBeInTheDocument();
                expect(avatarImageContainer!.style.backgroundImage).toBe('url(https://user-image-url)');
            });
        });

        describe('When the avatar is updated', () => {
            it('Should update the user persona photo', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
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

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'X-Assistant',
                            avatar: 'https://xuser-image-url',
                        },
                    }}
                />);

                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux-comp-chatItem--sent > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > .avatarContainer > .avatarPicture';
                const avatarImageContainer = container.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://xuser-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://xuser-image-url)');
            });
        });
    });

    describe('When the user persona is set with JSX as element', () => {
        describe('When the user sends a message', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'Mr User',
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

                // Assert
                const selector = '.nlux-comp-chatItem--sent > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > #jsx-avatar';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('User persona JSX should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'Mr User',
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

                // Assert
                const selector = '.nlux-comp-chatItem--sent > .nlux-comp-chatItem-participantInfo > .nlux-comp-avatar > #jsx-avatar';
                const avatarJsxContainer = container.querySelector(selector);
                expect(avatarJsxContainer).toBeInTheDocument();
                expect(avatarJsxContainer).toHaveTextContent('JSX Avatar');
            });
        });
    });
});
