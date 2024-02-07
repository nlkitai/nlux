import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When messageReceived event handler is used with a Promise adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called with message', async () => {
        const messageReceived = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageReceived: messageReceived,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(messageReceived).toHaveBeenCalledWith('Yo!');
    });
});

describe('When messageReceived event handler is used with a Streaming adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withStreamText().create();
    });

    it('should be called with message when stream is complete', async () => {
        const messageReceived = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageReceived: messageReceived,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.next('Hello');
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(messageReceived).not.toHaveBeenCalledWith('Hello');

        adapterController.next(' AI Bot!');
        adapterController.complete();
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(messageReceived).toHaveBeenCalledWith('Hello AI Bot!');
    });

    it('should not be called if the content is empty', async () => {
        const messageReceived = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageReceived: messageReceived,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        adapterController.next('');
        adapterController.complete();
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(messageReceived).not.toHaveBeenCalledWith('');
    });
});
