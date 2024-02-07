import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {submit, type} from '../../../utils/userInteractions';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When the user persona is set', () => {
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
                user: {
                    name: 'User',
                    picture: 'https://user-image-url',
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
        expect(queries.sentMessagePersonaPhotoLetter()).toHaveTextContent('U');
        expect(queries.receivedMessagePersonaContainer()).not.toBeInTheDocument();
    });

    it('Should render the persona photo when a URL is provided', async () => {
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                user: {
                    name: 'User',
                    picture: 'https://user-image-url',
                },
            });

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello LLM');
        await submit();

        await waitForMilliseconds(100);
        expect(queries.sentMessagePersonaRenderedPhoto()).toHaveAttribute(
            'style',
            'background-image: url(https://user-image-url);',
        );
    });

    it('Should render the persona photo when a DOM element is provided', async () => {
        const botImage = document.createElement('div');
        botImage.innerHTML = 'Bot Image';

        const userImage = document.createElement('div');
        userImage.innerHTML = 'User Image';

        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions({
                bot: {
                    name: 'Bot',
                    picture: botImage,
                },
                user: {
                    name: 'User',
                    picture: userImage,
                },
            });

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello LLM');
        await submit();

        await waitForMilliseconds(100);

        expect(queries.sentMessagePersonaContainer()).toHaveTextContent('User Image');
        expect(queries.receivedMessagePersonaContainer()).toHaveTextContent('Bot Image');
    });
});
