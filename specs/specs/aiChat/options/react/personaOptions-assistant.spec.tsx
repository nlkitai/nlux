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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn';
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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImage = container.querySelector(selector) as HTMLElement | null;
                expect(avatarImage).toBeInTheDocument();
                expect(avatarImage!.style.backgroundImage).toBe('url(https://assistant-image-url)');
            });

            it('Assistant initial letter should be rendered', async () => {
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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarImage = container.querySelector(selector);
                expect(avatarImage).toBeInTheDocument();
                expect(avatarImage!.textContent).toBe('A');
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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
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
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = container.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://xbot-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://xbot-image-url)');

                const letterSelector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarLetterContainer = container.querySelectorAll(letterSelector);
                expect(avatarLetterContainer).toHaveLength(2);
                expect(avatarLetterContainer[0]).toHaveTextContent('X');
                expect(avatarLetterContainer[1]).toHaveTextContent('X');
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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
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

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForReactRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
                const avatarJsxContainer = container.querySelector(selector);
                expect(avatarJsxContainer).toBeInTheDocument();
                expect(avatarJsxContainer).toHaveTextContent('JSX Avatar');
            });
        });
    });
});
