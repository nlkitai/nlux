import {AiChat, PersonaOptions} from '@nlux/react';
import {act, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When the personaOptions is used with a React component', () => {
    let adapterController: AdapterController;
    let personaOptions: PersonaOptions;

    let getDefaultPersonaOptions = (includeBot: boolean = false, includeUser: boolean = false): PersonaOptions => ({
        bot: includeBot ? ({
            name: 'Mr Bot',
            picture: 'https://i.imgur.com/7Qqnj1E.png',
            tagline: 'AI Assistant',
        }) : undefined,
        user: includeUser ? ({
            name: 'Ms User',
            picture: 'https://i.imgur.com/7Qqnj1E.png',
        }) : undefined,
    });

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        personaOptions = getDefaultPersonaOptions();
    });

    describe('When bot is provided', () => {
        it('should render the component', async () => {
            personaOptions = getDefaultPersonaOptions(true, false);
            const component = <AiChat adapter={adapterController.adapter} personaOptions={personaOptions}/>;

            render(component);
            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeInTheDocument();
            expect(queries.welcomeMessage()).toBeInTheDocument();
            expect(queries.welcomeMessage()).toHaveTextContent('Mr Bot');
            expect(queries.welcomeMessage()).toHaveTextContent('AI Assistant');
        });

        describe('When bot is removed', () => {
            it('should update the component to remove the welcome message', async () => {
                const personasWithBot = getDefaultPersonaOptions(true, false);
                const component = <AiChat adapter={adapterController.adapter} personaOptions={personasWithBot}/>;

                const {rerender} = render(component);
                await waitForRenderCycle();

                expect(queries.promptBoxTextInput()).toBeDefined();
                expect(queries.welcomeMessage()).toBeInTheDocument();
                expect(queries.welcomeMessage()).toHaveTextContent('Mr Bot');
                expect(queries.welcomeMessage()).toHaveTextContent('AI Assistant');

                await act(async () => rerender(<AiChat adapter={adapterController.adapter}/>));
                await waitForRenderCycle();

                expect(queries.promptBoxTextInput()).toBeInTheDocument();
                expect(queries.welcomeMessage()).not.toBeInTheDocument();
            });
        });
    });

    describe('When bot persona is removed then set back', () => {
        it('should update the component to remove the welcome message then add it back', async () => {
            const personasWithBot = getDefaultPersonaOptions(true, false);
            if (!adapterController || !personasWithBot.bot?.name || !personasWithBot.bot?.tagline) {
                throw new Error('Test setup error');
            }

            const component = <AiChat adapter={adapterController.adapter} personaOptions={personasWithBot}/>;

            const {rerender} = render(component);
            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeDefined();
            expect(queries.welcomeMessage()).toBeDefined();

            await act(async () => rerender(<AiChat adapter={adapterController.adapter}/>));
            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeInTheDocument();
            expect(queries.welcomeMessage()).not.toBeInTheDocument();

            await act(async () => rerender(
                <AiChat adapter={adapterController.adapter} personaOptions={personasWithBot}/>,
            ));
            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeInTheDocument();
            expect(queries.welcomeMessage()).toBeInTheDocument();

            expect(queries.welcomeMessage()).toHaveTextContent(personasWithBot.bot.name);
            expect(queries.welcomeMessage()).toHaveTextContent(personasWithBot.bot.tagline);
        });

        it('The welcome message should not be shown if some messages have already been sent', async () => {
            const personasWithBot = getDefaultPersonaOptions(true, false);
            const secondPersonaWithBot = getDefaultPersonaOptions(true, false);
            if (
                !adapterController || !personasWithBot.bot?.name ||
                !personasWithBot.bot?.tagline || !secondPersonaWithBot.bot
            ) {
                throw new Error('Test setup error');
            }

            secondPersonaWithBot.bot = {
                ...secondPersonaWithBot.bot,
                name: 'Second Bot',
            };

            const component = <AiChat adapter={adapterController.adapter} personaOptions={personasWithBot}/>;

            const {rerender} = render(component);
            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeDefined();
            expect(queries.welcomeMessage()).toBeDefined();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMilliseconds(delayBeforeSendingResponse / 2);

            adapterController.resolve('Hello');
            await waitForRenderCycle();

            expect(queries.conversationMessagesContainer()).toHaveTextContent('Hello');
            expect(queries.welcomeMessage()).not.toBeInTheDocument();

            await act(async () => rerender(
                <AiChat adapter={adapterController.adapter} personaOptions={secondPersonaWithBot}/>,
            ));

            await waitForRenderCycle();

            expect(queries.promptBoxTextInput()).toBeInTheDocument();
            expect(queries.welcomeMessage()).not.toBeInTheDocument();
        });
    });
});
