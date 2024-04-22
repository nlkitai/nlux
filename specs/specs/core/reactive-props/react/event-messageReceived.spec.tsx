import {AiChat} from '@nlux/react';
import {act, render} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When messageReceived is added as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called with message', async () => {
        const messageReceived = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
        />;

        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);
        expect(messageReceived).not.toHaveBeenCalled();

        await act(async () => rerender(
            <AiChat
                adapter={adapterController.adapter}
                events={{
                    messageReceived: messageReceived,
                }}
            />,
        ));

        await waitForRenderCycle();
        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(messageReceived).toHaveBeenCalledWith('Yo!');
    });
});

describe('When messageReceived is removed as a reactive prop', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should not be called with message', async () => {
        const messageReceived = vi.fn();
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
