import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {submit, type} from '../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When messageReceived event handler is used with a Vanilla JS Component', () => {
    let rootElement: HTMLElement;
    let adapterController: AdapterController | undefined = undefined;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    it('should be called when the promise resolves', async () => {
        const messageReceivedCallback = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageReceived', messageReceivedCallback);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        expect(messageReceivedCallback).toHaveBeenCalledWith(
            'This is a response!',
        );
    });

    it('should not be called when matching callback is removed', async () => {
        const messageReceivedCallback1 = jest.fn();
        const messageReceivedCallback2 = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageReceived', messageReceivedCallback1)
            .on('messageReceived', messageReceivedCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        aiChat.removeEventListener('messageReceived', messageReceivedCallback2);

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        expect(messageReceivedCallback1).toHaveBeenCalledTimes(2);
        expect(messageReceivedCallback2).toHaveBeenCalledTimes(1);
    });

    it('should not be called when all callbacks for event are removed', async () => {
        const messageReceivedCallback1 = jest.fn();
        const messageReceivedCallback2 = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageReceived', messageReceivedCallback1)
            .on('messageReceived', messageReceivedCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        aiChat.removeAllEventListeners();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        expect(messageReceivedCallback1).not.toHaveBeenCalled();
        expect(messageReceivedCallback2).not.toHaveBeenCalled();
    });
});
