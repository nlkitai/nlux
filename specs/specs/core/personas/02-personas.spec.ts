import {AiChat, createAiChat} from '@nlux/core';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {submit, type} from '../../../utils/userInteractions';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When the user provides personaOptions', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Persona profile pictures should be rendered when a message is submitted', async () => {
        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                bot: {
                    name: 'Bot',
                    picture: 'https://i.imgur.com/7QuesI3.png',
                },
                user: {
                    name: 'User',
                    picture: 'https://i.imgur.com/7QuesI3.png',
                },
            });

        aiChat.mount(rootElement);

        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await type('Hello LLM');

        expect(textInput.value).toBe('Hello LLM');
        expect(sendButton).not.toBeDisabled();

        await userEvent.click(sendButton);
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        expect(queries.sentMessagePersonaContainer()).toBeInTheDocument();
        expect(queries.receivedMessagePersonaContainer()).toBeInTheDocument();
    });
});

describe('When no personaOptions is provided', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Persona profile pictures should not be rendered when no persona configuration is provided', async () => {
        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter);

        aiChat.mount(rootElement);

        await waitForRenderCycle();

        await type('Hello LLM');
        await submit();
        await waitForMilliseconds(100);

        expect(queries.sentMessagePersonaContainer()).not.toBeInTheDocument();
        expect(queries.receivedMessagePersonaContainer()).not.toBeInTheDocument();
    });
});
