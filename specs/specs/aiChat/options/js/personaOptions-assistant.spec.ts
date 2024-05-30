import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + personaOptions + assistant', () => {
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

    describe('When no assistant persona is set', () => {
        it('The NLUX logo should be rendered as welcome message', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const logoContainer = rootElement.querySelector('.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn');
            expect(logoContainer).toBeInTheDocument();
            expect(logoContainer!.innerHTML).toEqual(
                expect.stringContaining('<div class="avtr_img" style="background-image: url(data:image/png;base64,'),
            );
        });

        describe('When the assistant persona is set after initial render', () => {
            it('Assistant persona details should be rendered instead of the NLUX logo', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    personaOptions: {
                        assistant: {
                            name: 'Assistant Name',
                            avatar: 'https://assistant-image-url',
                        },
                    },
                });

                await waitForRenderCycle();

                // Assert
                const selector = '.nlux-comp-wlc_msg > .nlux-comp-avtr > .avtr_ctn';
                const avatarContainer = rootElement.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
                expect(avatarContainer!.querySelector('.avtr_img')).toHaveStyle(
                    'background-image: url(https://assistant-image-url)',
                );
            });
        });
    });

    describe('When the assistant persona is set with image URL and name', () => {
        describe('When the assistant sends a response', () => {
            it('Assistant persona details should be rendered', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant Name',
                            avatar: 'https://assistant-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                await userEvent.type(textArea, 'Write some JS code{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('console.log("Hello, World!");');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn';
                const avatarContainer = rootElement.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });

            it('Assistant persona photo should be rendered', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant Name',
                            avatar: 'https://assistant-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Hi, how can I help you?');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = rootElement.querySelector(selector) as HTMLDivElement | null;
                expect(avatarImageContainer).toBeInTheDocument();
                expect(avatarImageContainer!.style.backgroundImage).toBe('url(https://assistant-image-url)');
            });
        });

        describe('When the assistant avatar is updated', () => {
            it('Should update the assistant persona photo', async () => {
                // Arrange
                const aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions({
                        assistant: {
                            name: 'Assistant Name',
                            avatar: 'https://assistant-image-url',
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

                adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({
                    personaOptions: {
                        assistant: {
                            name: 'X Assistant',
                            avatar: 'https://x-assistant-image-url',
                        },
                    },
                });

                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn > .avtr_img';
                const avatarImageContainer = rootElement.querySelectorAll(selector);
                expect(avatarImageContainer).toHaveLength(2);
                expect(avatarImageContainer[0]).toHaveStyle('background-image: url(https://x-assistant-image-url)');
                expect(avatarImageContainer[1]).toHaveStyle('background-image: url(https://x-assistant-image-url)');
            });
        });

        describe('When the assistant persona is set with DOM element as avatar', () => {
            describe('When the assistant sends a response', () => {
                it('Assistant persona details should be rendered', async () => {
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
                            assistant: {
                                name: 'Assistant Name',
                                avatar,
                            },
                        });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    adapterController!.resolve('Hi, how can I help you?');
                    await waitForRenderCycle();

                    // Assert
                    const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
                    const avatarContainer = rootElement.querySelector(selector);
                    expect(avatarContainer).toBeInTheDocument();
                });

                it('Assistant persona DOM element should be rendered', async () => {
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
                            assistant: {
                                name: 'Assistant Name',
                                avatar,
                            },
                        });

                    aiChat.mount(rootElement);
                    await waitForRenderCycle();

                    const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                    await userEvent.type(textArea, 'Hello{enter}');
                    await waitForRenderCycle();

                    adapterController!.resolve('Hi, how can I help you?');
                    await waitForRenderCycle();

                    // Assert
                    const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > #jsx-avatar';
                    const avatarJsxContainer = rootElement.querySelector(selector);
                    expect(avatarJsxContainer).toBeInTheDocument();
                    expect(avatarJsxContainer).toHaveTextContent('DOM HTML Avatar');
                });
            });
        });
    });

    describe('When the assistant persona is unset after being set', () => {
        it('All assistant persona details should be removed', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions({
                    assistant: {
                        name: 'Assistant Name',
                        avatar: 'https://assistant-image-url',
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

            adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
            await waitForRenderCycle();

            // Assert
            const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr';
            let avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).toBeInTheDocument();

            // Act
            aiChat.updateProps({
                personaOptions: {
                    assistant: undefined,
                },
            });

            await waitForRenderCycle();

            // Assert
            avatarImageContainer = rootElement.querySelector(selector);
            expect(avatarImageContainer).not.toBeInTheDocument();
        });
    });

    describe('When the personaOptions with assistant persona is unset after being set', () => {
        it('All persona details should be removed', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions({
                    assistant: {
                        name: 'Assistant Name',
                        avatar: 'https://assistant-image-url',
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

            adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
            await waitForRenderCycle();

            // Assert
            const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr';
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

    describe('When the assistant persona is set after initial render', () => {
        it('Persona details should be rendered for every chat item', async () => {
            // Arrange
            const aiChat = createAiChat()
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const selector = '.nlux_cht_itm_rcvd > .nlux-comp-cht_itm-prt_info > .nlux-comp-avtr > .avtr_ctn';

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi, how can I help you?');
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Tell me a funny joke!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Why did the chicken cross the road? To get to the other side!');
            await waitForRenderCycle();

            // Assert
            let avatarContainer = rootElement.querySelectorAll(selector);
            expect(avatarContainer).toHaveLength(0);

            // Act
            aiChat.updateProps({
                personaOptions: {
                    assistant: {
                        name: 'Assistant Name',
                        avatar: 'https://assistant-image-url',
                    },
                },
            });

            await waitForRenderCycle();

            // Assert
            avatarContainer = rootElement.querySelectorAll(selector);
            expect(avatarContainer).toHaveLength(2);

            expect(avatarContainer[0].querySelector('.avtr_img')).toHaveStyle(
                'background-image: url(https://assistant-image-url)',
            );

            expect(avatarContainer[1].querySelector('.avtr_img')).toHaveStyle(
                'background-image: url(https://assistant-image-url)',
            );
        });
    });
});
