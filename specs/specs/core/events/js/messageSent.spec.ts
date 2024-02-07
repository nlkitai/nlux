import {AiChat, createAiChat} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When messageSent event handler is used with a Vanilla JS Component', () => {
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
        const messageSentCallback = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageSent', messageSentCallback);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello bot!');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        expect(messageSentCallback).toHaveBeenCalledWith(
            'Hello bot!',
        );
    });

    it('should not be called when matching callback is removed', async () => {
        const messageSentCallback1 = vi.fn();
        const messageSentCallback2 = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageSent', messageSentCallback1)
            .on('messageSent', messageSentCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello bot!');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        aiChat.removeEventListener('messageSent', messageSentCallback2);

        await type('What is your name?');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('My name is Bot!');
        await waitForRenderCycle();

        expect(messageSentCallback1).toHaveBeenCalledTimes(2);
        expect(messageSentCallback2).toHaveBeenCalledTimes(1);
    });

    it('should not be called when all callbacks for event are removed', async () => {
        const messageSentCallback1 = vi.fn();
        const messageSentCallback2 = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('messageSent', messageSentCallback1)
            .on('messageSent', messageSentCallback2);

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        aiChat.removeAllEventListeners();

        await type('Hello bot!');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse);
        adapterController.resolve('This is a response!');
        await waitForRenderCycle();

        expect(messageSentCallback1).not.toHaveBeenCalled();
        expect(messageSentCallback2).not.toHaveBeenCalled();
    });
});
