import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When error event handler is used with a Vanilla JS Component', () => {
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

    it('should be called when the promise rejects', async () => {
        const errorCallback = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('error', errorCallback);

        aiChat.mount(rootElement);
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

    it('should not be called when matching callback is removed', async () => {
        const errorCallback1 = jest.fn();
        const errorCallback2 = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('error', errorCallback1)
            .on('error', errorCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        aiChat.removeEventListener('error', errorCallback1);
        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.reject('This is an error!');
        await waitForRenderCycle();

        expect(errorCallback1).not.toHaveBeenCalled();
        expect(errorCallback2).toHaveBeenCalledWith(
            expect.objectContaining({
                errorId: 'NX-AD-001',
                message: expect.any(String),
            }),
        );
    });

    it('should not be called when all callbacks for event are removed', async () => {
        const errorCallback1 = jest.fn();
        const errorCallback2 = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('error', errorCallback1)
            .on('error', errorCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        aiChat.removeAllEventListeners('error');
        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.reject('This is an error!');
        await waitForRenderCycle();

        expect(errorCallback1).not.toHaveBeenCalled();
        expect(errorCallback2).not.toHaveBeenCalled();
    });

    it('should not be called when all callbacks for all events are removed', async () => {
        const errorCallback1 = jest.fn();
        const errorCallback2 = jest.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('error', errorCallback1)
            .on('error', errorCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        aiChat.removeAllEventListeners();
        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.reject('This is an error!');
        await waitForRenderCycle();

        expect(errorCallback1).not.toHaveBeenCalled();
        expect(errorCallback2).not.toHaveBeenCalled();
    });
});
