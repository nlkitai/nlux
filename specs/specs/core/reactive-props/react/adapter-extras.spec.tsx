import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds} from '../../../../utils/wait';

describe('When the adapter consuming extra props is used with a React component', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('adapter should receive props in extras', async () => {
        const {getByTestId} = render(
            <AiChat
                adapter={adapterController.adapter}
                personaOptions={{
                    bot: {
                        name: 'Test Bot',
                        picture: 'https://example.com/test-bot-image.png',
                        tagline: 'Test Bot Tagline',
                    },
                    user: {
                        name: 'Test User',
                        picture: 'https://example.com/test-user-image.png',
                    },
                }}
            />,
        );

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.aiChatProps?.personaOptions).toEqual({
            bot: {
                name: 'Test Bot',
                picture: 'https://example.com/test-bot-image.png',
                tagline: 'Test Bot Tagline',
            },
            user: {
                name: 'Test User',
                picture: 'https://example.com/test-user-image.png',
            },
        });
    });

    describe('When the component props change', () => {
        it('adapter should receive updated props in extras', async () => {
            const {rerender} = render(
                <AiChat
                    adapter={adapterController.adapter}
                    personaOptions={{
                        bot: {
                            name: 'Test Bot',
                            picture: 'https://example.com/test-bot-image.png',
                            tagline: 'Test Bot Tagline',
                        },
                        user: {
                            name: 'Test User',
                            picture: 'https://example.com/test-user-image.png',
                        },
                    }}
                />,
            );

            await type('Hello');
            await submit();
            await waitForMilliseconds(delayBeforeSendingResponse / 2);

            adapterController.resolve('Yo!');
            await waitForMilliseconds(delayBeforeSendingResponse);
            expect(adapterController.getLastExtras()?.aiChatProps?.className).toEqual(undefined);

            rerender(
                <AiChat
                    adapter={adapterController.adapter}
                    className={'test-class'}
                    personaOptions={{
                        bot: {
                            name: 'Updated Bot',
                            picture: 'https://example.com/updated-bot-image.png',
                            tagline: 'Updated Bot Tagline',
                        },
                        user: {
                            name: 'Updated User',
                            picture: 'https://example.com/updated-user-image.png',
                        },
                    }}
                />,
            );

            await type('Hello');
            await submit();
            await waitForMilliseconds(delayBeforeSendingResponse / 2);

            adapterController.resolve('Yo!');
            await waitForMilliseconds(delayBeforeSendingResponse);

            expect(adapterController.getLastExtras()?.aiChatProps?.className).toEqual('test-class');
            expect(adapterController.getLastExtras()?.aiChatProps?.personaOptions).toEqual({
                bot: {
                    name: 'Updated Bot',
                    picture: 'https://example.com/updated-bot-image.png',
                    tagline: 'Updated Bot Tagline',
                },
                user: {
                    name: 'Updated User',
                    picture: 'https://example.com/updated-user-image.png',
                },
            });
        });
    });
});
