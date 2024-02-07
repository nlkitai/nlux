import {AiChat} from '@nlux/react';
import {act, render} from '@testing-library/react';
import React from 'react';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import '@testing-library/jest-dom';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When error handler is added as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called on error', async () => {
        const errorCallback = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
        />;

        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.reject('This is an error!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(errorCallback).not.toHaveBeenCalled();

        await act(async () => rerender(
            <AiChat
                adapter={adapterController.adapter}
                events={{
                    error: errorCallback,
                }}
            />,
        ));

        await waitForRenderCycle();

        await type('Hello again');
        await submit();

        adapterController.reject('This is an error!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(errorCallback).toHaveBeenCalledWith({
            errorId: 'NX-AD-001',
            message: expect.any(String),
        });
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

describe('When error handler is removed as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should not be called on error', async () => {
        const errorCallback = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                error: errorCallback,
            }}
        />;

        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.reject('This is an error!');
        await waitForRenderCycle();

        expect(errorCallback).toHaveBeenCalledWith({
            errorId: 'NX-AD-001',
            message: expect.any(String),
        });

        await act(async () => rerender(
            <AiChat adapter={adapterController.adapter}/>,
        ));

        await type('Hello again');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        await waitForRenderCycle();
        adapterController.reject('This is an error!');

        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(errorCallback).toHaveBeenCalledTimes(1);
    });
});
