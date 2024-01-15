import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {submit, type} from '../../utils/userInteractions';
import {waitForRenderCycle} from '../../utils/wait';

describe('Personas config is provided', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    const personasConfig = {
        bot: {
            name: 'Bot',
            picture: 'https://i.imgur.com/7QuesI3.png',
            tagline: 'I am a bot',
        },
        user: {
            name: 'User',
            picture: 'https://i.imgur.com/7QuesI3.png',
        },
    };

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('Welcome message should be rendered to the users', async () => {
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions(personasConfig);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        expect(queries.welcomeMessage()).toBeInTheDocument();
        expect(queries.welcomeMessageBotName()).toHaveTextContent('Bot');
        expect(queries.welcomeMessageBotTagline()).toHaveTextContent('I am a bot');
    });

    it('Welcome message should be hidden when the user sends a message', async () => {
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withPersonaOptions(personasConfig);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        expect(queries.welcomeMessage()).toBeInTheDocument();

        await type('Hello LLM');
        expect(queries.welcomeMessage()).toBeInTheDocument();

        await submit();
        await waitForRenderCycle();

        expect(queries.welcomeMessage()).not.toBeInTheDocument();
    });

    it('Welcome message should be displayed back if the first message is deleted', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter).withPersonaOptions(personasConfig);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        expect(queries.welcomeMessage()).toBeInTheDocument();

        await type('Hello LLM');
        await submit();

        expect(queries.welcomeMessage()).not.toBeInTheDocument();

        adapterController.reject('Error!');
        await waitForRenderCycle();

        expect(queries.welcomeMessage()).toBeInTheDocument();
    });
});
