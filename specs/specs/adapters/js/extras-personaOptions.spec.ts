import {AiChat, createAiChat, PersonaOptions} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter() + personaOptions extras', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    // Randomly assign fetch/stream adapters — Tests should work the same way
    const shouldUseFetch = Math.random() > 0.5;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(shouldUseFetch)
            .withStreamText(!shouldUseFetch)
            .create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Persona Options should be provided to the adapter as part of extras attribute', async () => {
        // Arrange
        const testPersonaOptions: PersonaOptions = {
            bot: {
                name: 'Test Bot',
                picture: 'https://example.com/test-bot-image.png',
                tagline: 'Test Bot Tagline',
            },
            user: {
                name: 'Test User',
                picture: 'https://example.com/test-user-image.png',
            },
        };

        aiChat = createAiChat()
            .withAdapter(adapterController!.adapter)
            .withPersonaOptions(testPersonaOptions);

        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(adapterController.getLastExtras()?.aiChatProps?.personaOptions)
            .toEqual(testPersonaOptions);
    });

    describe('When persona options are updated', () => {
        it('New options should be provided to the adapter as part of extras attribute', async () => {
            // Arrange
            const testPersonaOptions: PersonaOptions = {
                bot: {
                    name: 'Test Bot',
                    picture: 'https://example.com/test-bot-image.png',
                    tagline: 'Test Bot Tagline',
                },
                user: {
                    name: 'Test User',
                    picture: 'https://example.com/test-user-image.png',
                },
            };

            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions(testPersonaOptions);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController.resolve('Cheers!');
            aiChat.updateProps({
                personaOptions: {
                    bot: {
                        name: 'New Bot',
                        picture: 'https://example.com/new-bot-image.png',
                        tagline: 'New Bot Tagline',
                    },
                    user: {
                        name: 'New User',
                        picture: 'https://example.com/new-user-image.png',
                    },
                },
            });

            textArea.focus();
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Bonjour{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController.getLastExtras()?.aiChatProps.personaOptions).toEqual({
                bot: {
                    name: 'New Bot',
                    picture: 'https://example.com/new-bot-image.png',
                    tagline: 'New Bot Tagline',
                },
                user: {
                    name: 'New User',
                    picture: 'https://example.com/new-user-image.png',
                },
            });
        });
    });
});
