import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + bot persona + welcome message', () => {
    let adapterController: AdapterController | undefined = undefined;

    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When bot persona is configured and a tagline is provided', () => {
        describe('When no initial conversation is provided', () => {
            it('The welcome message should be displayed', async () => {
                // Arrange
                adapterController = adapterBuilder().withFetchText().create();
                aiChat = createAiChat()
                    .withAdapter(adapterController.adapter)
                    .withPersonaOptions({
                        bot: {
                            name: 'Bot',
                            picture: 'https://example.com/bot.png',
                            tagline: 'Welcome to the chat',
                        },
                    });

                // Act
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Assert
                const welcomeMessage = rootElement.querySelector('.nlux-comp-wlc_msg')!;
                expect(welcomeMessage).not.toBeNull();
                expect(welcomeMessage.textContent).toContain('Welcome to the chat');
            });
        });
    });
});
