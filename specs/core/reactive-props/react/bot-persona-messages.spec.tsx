import {AiChat, PersonaOptions} from '@nlux/react';
import {act, render} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {submit, type} from '../../../utils/userInteractions';
import {
    delayBeforeSendingResponse,
    shortDelayBeforeSendingResponse,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../../utils/wait';

describe('When the personaOptions.bot is used with conversation', () => {
    let adapterController: AdapterController;
    let personaOptions: PersonaOptions;

    let getDefaultPersonaOptions = (includeBot: boolean = false, includeUser: boolean = false): PersonaOptions => ({
        bot: includeBot ? ({
            name: 'Mr Bot',
            picture: 'https://bot-image-url',
            tagline: 'AI Assistant',
        }) : undefined,
        user: includeUser ? ({
            name: 'Ms User',
            picture: 'https://user-image-url',
        }) : undefined,
    });

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        personaOptions = getDefaultPersonaOptions(true);
    });

    it('Persona details should render before each message', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const personasPhotoQuery = '[style*="background-image: url(https://bot-image-url);"]';
        const personasNameQuery = '.nluxc-text-message-persona-letter';

        render(component);

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(queries.receivedMessagePersonaPhotoLetter()).toHaveTextContent('M');
        expect(document.querySelectorAll(personasPhotoQuery)).toHaveLength(1);
        expect(document.querySelectorAll(personasNameQuery)).toHaveLength(1);

        await type('Hi!');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yay!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(personasPhotoQuery)).toHaveLength(2);
        expect(document.querySelectorAll(personasNameQuery)).toHaveLength(2);
    });

    it('Persona details should update when the personaOptions.bot changes', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const personasPhotoQuery = '[style*="background-image: url(https://bot-image-url);"]';
        const newPersonasPhotoQuery = '[style*="background-image: url(https://new-bot-image-url);"]';
        const personasNameQuery = '.nluxc-text-message-persona-letter';

        const {rerender} = render(component);

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        await type('Hi!');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yay!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(personasPhotoQuery)).toHaveLength(2);
        expect(document.querySelectorAll(personasNameQuery)).toHaveLength(2);

        const newPersonaOptions = {
            ...personaOptions,
            bot: {
                name: 'New Bot',
                picture: 'https://new-bot-image-url',
                tagline: 'New AI Assistant',
            },
        };

        expect(queries.receivedMessagePersonaPhotoLetter()).toHaveTextContent('M');
        expect(queries.receivedMessagePersonaPhotoLetter()).not.toHaveTextContent('N');

        await act(async () => rerender(
            <AiChat adapter={adapterController.adapter} personaOptions={newPersonaOptions}/>,
        ));

        await waitForRenderCycle();
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(newPersonasPhotoQuery)).toHaveLength(2);

        expect(queries.receivedMessagePersonaPhotoLetter()).toHaveTextContent('N');
        expect(queries.receivedMessagePersonaPhotoLetter()).not.toHaveTextContent('M');
    });

    it('New messages should be created with the new persona details', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const newPersonasPhotoQuery = '[style*="background-image: url(https://new-bot-image-url);"]';

        const {rerender} = render(component);

        await type('Hello');
        await submit();
        await waitForMilliseconds(shortDelayBeforeSendingResponse);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        const newPersonaOptions = {
            ...personaOptions,
            bot: {
                name: 'New Bot',
                picture: 'https://new-bot-image-url',
                tagline: 'New AI Assistant',
            },
        };

        await act(async () => rerender(
            <AiChat adapter={adapterController.adapter} personaOptions={newPersonaOptions}/>,
        ));
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(newPersonasPhotoQuery)).toHaveLength(1);

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(newPersonasPhotoQuery)).toHaveLength(2);
    });
});
