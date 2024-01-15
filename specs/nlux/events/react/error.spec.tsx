import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {submit, type} from '../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When error event handler is used with a Promise adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called when the promise rejects', async () => {
        const errorCallback = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                error: errorCallback,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.reject('This is an error!');
        await waitForRenderCycle();

        expect(errorCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                errorId: 'NX-AD-001',
                message: expect.any(String),
            }),
        );
    });
});

describe('When error event handler is used with a Stream adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withStreamText().create();
    });

    it('should be called when the stream throws an error', async () => {
        const errorCallback = jest.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                error: errorCallback,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.next('Hi, how');
        adapterController.error(new Error('This is a stream error!'));
        await waitForRenderCycle();

        expect(errorCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                errorId: 'NX-AD-001',
                message: expect.any(String),
            }),
        );
    });
});
