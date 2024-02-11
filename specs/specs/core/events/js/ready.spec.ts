import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('When ready event handler is used with a Vanilla JS Component', () => {
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

    it('should be called when the component is ready', async () => {
        const readyCallback = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('ready', readyCallback);

        await waitForRenderCycle();
        expect(readyCallback).not.toHaveBeenCalled();

        aiChat.mount(rootElement);
        await waitForRenderCycle();
        expect(readyCallback).toHaveBeenCalledOnce();
    });

    it('should be called with initialisation options', async () => {
        const readyCallback = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('ready', readyCallback)
            .withClassName('test-class');

        await waitForRenderCycle();
        expect(readyCallback).not.toHaveBeenCalled();

        aiChat.mount(rootElement);
        await waitForRenderCycle();

        expect(readyCallback).toHaveBeenCalledWith(expect.objectContaining({
            aiChatProps: {
                adapter: adapterController.adapter,
                className: 'test-class',
            },
        }));
    });
});
