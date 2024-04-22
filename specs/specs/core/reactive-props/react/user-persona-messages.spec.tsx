import {AiChat, PersonaOptions} from '@nlux/react';
import {act, render} from '@testing-library/react';
import {beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {queries} from '../../../../utils/selectors';
import {submit, type} from '../../../../utils/userInteractions';
import {
    delayBeforeSendingResponse,
    shortDelayBeforeSendingResponse,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../../../utils/wait';

describe('When the personaOptions.user is used with conversation', () => {
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
        personaOptions = getDefaultPersonaOptions(false, true);
    });

    it('Persona details should render before each message', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const personasPhotoQuery = '[style*="background-image: url(https://user-image-url);"]';
        const personasNameQuery = '.nlux-text-message-persona-letter';

        render(component);

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(queries.sentMessagePersonaPhotoLetter()).toHaveTextContent('M');
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

    it('Persona details should update when the personaOptions.user changes', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const personasPhotoQuery = '[style*="background-image: url(https://user-image-url);"]';
        const newPersonasPhotoQuery = '[style*="background-image: url(https://new-user-image-url);"]';
        const personasNameQuery = '.nlux-text-message-persona-letter';

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

        expect(queries.sentMessagePersonaPhotoLetter()).toHaveTextContent('M');
        expect(queries.sentMessagePersonaPhotoLetter()).not.toHaveTextContent('N');

        const newPersonaOptions = {
            user: {
                name: 'New User',
                picture: 'https://new-user-image-url',
            },
        };

        await act(async () => rerender(
            <AiChat adapter={adapterController.adapter} personaOptions={newPersonaOptions}/>,
        ));

        await waitForRenderCycle();
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(document.querySelectorAll(newPersonasPhotoQuery)).toHaveLength(2);

        expect(queries.sentMessagePersonaPhotoLetter()).toHaveTextContent('N');
        expect(queries.sentMessagePersonaPhotoLetter()).not.toHaveTextContent('M');
    });

    it('New messages should be created with the new persona details', async () => {
        const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;
        const newPersonasPhotoQuery = '[style*="background-image: url(https://new-user-image-url);"]';

        const {rerender} = render(component);

        await type('Hello');
        await submit();
        await waitForMilliseconds(shortDelayBeforeSendingResponse);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        const newPersonaOptions = {
            ...personaOptions,
            user: {
                name: 'New User',
                picture: 'https://new-user-image-url',
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
