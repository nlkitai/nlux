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
            .withFetchText(true)
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
                            picture: 'https://user-image-url',
                        },
                    });

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                await userEvent.type(textArea, 'Write some JS code{enter}');
                await waitForRenderCycle();

                // Assert
                const selector = '.nlux_cht_itm_out > .nlux-comp-avtr > .avtr_ctn';
                const avatarContainer = rootElement.querySelector(selector);
                expect(avatarContainer).toBeInTheDocument();
            });
        });
    });
});
