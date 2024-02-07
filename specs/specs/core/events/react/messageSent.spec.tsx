import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When messageSent event handler is used with a Promise adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called with message', async () => {
        const messageSent = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageSent,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse / 2);
        expect(messageSent).toHaveBeenCalledWith('Hello');
    });
});

describe('When messageSent event handler is used with a Streaming adapter', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withStreamText().create();
    });

    it('should be called with message as soon when the message is submitted', async () => {
        const messageSent = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                messageSent,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);
        expect(messageSent).toHaveBeenCalledWith('Hello');
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

        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(messageReceived).not.toHaveBeenCalled();
    });
});
