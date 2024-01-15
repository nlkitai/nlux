import {AiChat} from '@nlux/react';
import {act, render} from '@testing-library/react';
import React from 'react';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import '@testing-library/jest-dom';
import {submit, type} from '../../../utils/userInteractions';
import {
    delayBeforeSendingResponse,
    waitForMdStreamToComplete,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../../utils/wait';

describe('When messageSent is added as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called with message sent', async () => {
        const messageSent = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
        />;

        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);
        expect(messageSent).not.toHaveBeenCalled();

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);
        await waitForMdStreamToComplete();

        await act(async () => rerender(
            <AiChat
                adapter={adapterController.adapter}
                events={{
                    messageSent,
                }}
            />,
        ));

        await waitForRenderCycle();
        await type('What\'s your ID?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(messageSent).toHaveBeenCalledWith('What\'s your ID?');
    });
});

describe('When messageReceived is removed as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should not be called with message', async () => {
        const messageReceived = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageReceived: messageReceived,
            }}
        />;

        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Hi!');
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(messageReceived).toHaveBeenCalledWith('Hi!');

        await act(async () => rerender(
            <AiChat adapter={adapterController.adapter}/>,
        ));

        await type('What\'s your name?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        await waitForRenderCycle();
        adapterController.resolve('ChatBot-One!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(messageReceived).toHaveBeenCalledTimes(1);
    });
});
