import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForMilliseconds, waitForRenderCycle} from '../../utils/wait';

describe('When the bot persona is set', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Persona details should be rendered when a message is sent', async () => {
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                bot: {
                    name: 'Bot',
                    picture: 'https://bot-image-url',
                },
            });

        aiChat.mount(rootElement);

        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello LLM');
        await waitForRenderCycle();

        expect(textInput.value).toBe('Hello LLM');
        expect(sendButton).not.toBeDisabled();

        await userEvent.click(sendButton);
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        expect(queries.sentMessagePersonaContainer()).not.toBeInTheDocument();
        expect(queries.receivedMessagePersonaContainer()).toBeInTheDocument();
        expect(queries.receivedMessagePersonaPhotoLetter()).toHaveTextContent('B');
    });

    it('Should render the persona photo when a URL is provided', async () => {
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                bot: {
                    name: 'Bot',
                    picture: 'https://bot-image-url',
                },
            });

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello LLM');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        expect(queries.receivedMessagePersonaRenderedPhoto()).toHaveAttribute(
            'style',
            'background-image: url(https://bot-image-url);',
        );
    });

    it('Should render the persona photo when a DOM element is provided', async () => {
        const botImage = document.createElement('div');
        botImage.innerHTML = 'Bot Image';

        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                bot: {
                    name: 'Bot',
                    picture: botImage,
                },
            });

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello LLM');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        expect(queries.receivedMessagePersonaContainer()).toHaveTextContent('Bot Image');
    });
});
