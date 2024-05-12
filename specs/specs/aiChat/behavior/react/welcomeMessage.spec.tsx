import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + bot persona + welcome message', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When bot persona is configured and a tagline is provided', () => {
        describe('When no initial conversation is provided', () => {
            it('The welcome message should be displayed', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        personaOptions={{
                            bot: {
                                name: 'Bot',
                                picture: 'https://example.com/bot.png',
                                tagline: 'Welcome to the chat',
                            },
                        }}
                    />
                );
                const {container} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                const welcomeMessage = container.querySelector('.nlux-comp-wlc_msg')!;
                expect(welcomeMessage).not.toBeNull();
                expect(welcomeMessage.textContent).toContain('Welcome to the chat');
            });
        });
    });
});
