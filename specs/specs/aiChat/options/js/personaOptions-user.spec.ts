import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + personaOptions + user', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the user persona is set with image URL and name', () => {
        describe('When the user sends a message', () => {
            it('Persona details should be rendered', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        user: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                await userEvent.type(textArea, 'Write some JS code{enter}');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn';
                const avatarContainer = rootElement.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Persona photo should be rendered', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        user: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = rootElement.querySelector(selector) as HTMLElement | null;
                expect(avatarImageContainer).toBeInTheDocument();
                expect(avatarImageContainer!.style.backgroundImage).toBe('url(https://user-image-url)');
            });

            it('Persona initial letter should be rendered', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        user: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarLetterContainer = rootElement.querySelector(selector);
                expect(avatarLetterContainer).toBeInTheDocument();
                expect(avatarLetterContainer).toHaveTextContent('M');
            });
        });

        describe('When the avatar is updated', () => {
            it('Should update the user persona photo', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        user: {
                            name: 'Mr User',
                            avatar: 'https://user-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Hi, how can I help you?');
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    personaOptions: {
                        user: {
                            name: 'X-User',
                            avatar: 'https://xuser-image-url',
                        },
                    },
                });

                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = rootElement.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://xuser-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://xuser-image-url)');

                const letterSelector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_ltr';
                const avatarLetterContainer = rootElement.querySelectorAll(letterSelector);
                expect(avatarLetterContainer).toHaveLength(2);
                expect(avatarLetterContainer[0]).toHaveTextContent('X');
                expect(avatarLetterContainer[1]).toHaveTextContent('X');
            });
        });

        describe('When the user persona is set with DOM element as avatar', () => {
            describe('When the user sends a message', () => {
                it('Persona details should be rendered', async () => {
                    // Arrange
                    const avatar = document.createElement('div');
                    avatar.id = 'jsx-avatar';
                    avatar.style.backgroundColor = 'red';
                    avatar.style.width = '50px';
                    avatar.style.height = '50px';
                    avatar.textContent = 'DOM HTML Avatar';

                    const aiChat = createAiChat()
                        .withAdapter(adapterController!.adapter)
                        .withPersonaOptions({
                            user: {name: 'Mr User', avatar},
                        });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    // Assert
                    const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
                    const avatarContainer = rootElement.querySelector(selector);
                    expect(avatarContainer).toBeInTheDocument();
                });

                it('Persona DOM element should be rendered', async () => {
                    // Arrange
                    const avatar = document.createElement('div');
                    avatar.id = 'jsx-avatar';
                    avatar.style.backgroundColor = 'red';
                    avatar.style.width = '50px';
                    avatar.style.height = '50px';
                    avatar.textContent = 'DOM HTML Avatar';

                    const aiChat = createAiChat()
                        .withAdapter(adapterController!.adapter)
                        .withPersonaOptions({
                            user: {
                                name: 'Mr User',
                                avatar,
                            },
                        });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    // Assert
                    const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
                    const avatarJsxContainer = rootElement.querySelector(selector);
                    expect(avatarJsxContainer).toBeInTheDocument();
                    expect(avatarJsxContainer).toHaveTextContent('DOM HTML Avatar');
                });
            });
        });
    });

    describe('When the user persona is unset after being set', () => {
        it('All persona details should be removed', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions({
                    user: {
                        name: 'Mr User',
                        avatar: 'https://user-image-url',
                    },
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi, how can I help you?');
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
            await waitForRenderCycle();

            // Assert
            const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr';
            let avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).toBeInTheDocument();

            // Act
            aiChat.updateProps({
                personaOptions: {
                    user: undefined,
                },
            });

            await waitForRenderCycle();

            // Assert
            avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).not.toBeInTheDocument();
        });
    });

    describe('When the personaOptions with user persona is unset after being set', () => {
        it('All persona details should be removed', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions({
                    user: {
                        name: 'Mr User',
                        avatar: 'https://user-image-url',
                    },
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi, how can I help you?');
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
            await waitForRenderCycle();

            // Assert
            const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr';
            let avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).toBeInTheDocument();

            // Act
            aiChat.updateProps({
                personaOptions: undefined,
            });

            await waitForRenderCycle();

            // Assert
            avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).not.toBeInTheDocument();
        });
    });

    describe('When the user persona is set after initial render', () => {
        it('Persona details should be rendered for every chat item', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const selector = '.nlux_cht_itm_out > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn';

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi, how can I help you?');
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
            await waitForRenderCycle();

            // Assert
            let avatarContainer = rootElement.querySelectorAll(selector);
            expect(avatarContainer).toHaveLength(0);

            // Act
            aiChat.updateProps({
                personaOptions: {
                    user: {
                        name: 'Mr User',
                        avatar: 'https://user-image-url',
                    },
                },
            });

            await waitForRenderCycle();

            // Assert
            avatarContainer = rootElement.querySelectorAll(selector);
            expect(avatarContainer).toHaveLength(2);
        });
    });
});
