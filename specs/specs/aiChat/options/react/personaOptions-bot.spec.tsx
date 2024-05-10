import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + personaOptions + bot', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the bot persona is set with image URL and name', () => {
        describe('When the user sends a message', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'Mr User',
                            picture: 'https://user-image-url',
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > .avtr_ctn';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Persona photo should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'AI Bot',
                            picture: 'https://bot-image-url',
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImage = container.querySelector(selector);
                expect(avatarImage).toBeInTheDocument();
                expect(avatarImage!.style.backgroundImage).toBe('url(https://bot-image-url)');
            });

            it('Bot initial letter should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'AI Bot',
                            picture: 'https://bot-image-url',
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarImage = container.querySelector(selector);
                expect(avatarImage).toBeInTheDocument();
                expect(avatarImage!.textContent).toBe('A');
            });
        });

        describe('When the picture is updated', () => {
            it('Should update the user persona photo', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        user: {
                            name: 'Mr Bot',
                            picture: 'https://bot-image-url',
                        },
                    }}
                />;

                const {container, rerender} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Hi, how can I help you?');
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
                await waitForRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'X-Bot',
                            picture: 'https://xbot-image-url',
                        },
                    }}
                />);

                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = container.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://xbot-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://xbot-image-url)');

                const letterSelector = '.nlux_cht_itm_in > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarLetterContainer = container.querySelectorAll(letterSelector);
                expect(avatarLetterContainer).toHaveLength(2);
                expect(avatarLetterContainer[0]).toHaveTextContent('X');
                expect(avatarLetterContainer[1]).toHaveTextContent('X');
            });
        });
    });

    describe('When the bot persona is set with JSX as element', () => {
        describe('When the bot sends a response', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'Mr Bot',
                            picture: <div id="jsx-avatar">JSX Avatar</div>,
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > #jsx-avatar';
                const avatarContainer = container.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Bot persona JSX should be rendered', async () => {
                // Arrange
                const aiChat = <AiChat
                    adapter={adapterController!.adapter}
                    personaOptions={{
                        bot: {
                            name: 'Mr Bot',
                            picture: <div id="jsx-avatar">JSX Avatar</div>,
                        },
                    }}
                />;

                // Act
                const {container} = render(aiChat);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController?.resolve('Hi there!');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_in > .nlux-comp-avtr > #jsx-avatar';
                const avatarJsxContainer = container.querySelector(selector);
                expect(avatarJsxContainer).toBeInTheDocument();
                expect(avatarJsxContainer).toHaveTextContent('JSX Avatar');
            });
        });
    });
});
