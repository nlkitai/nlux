import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('When pre-destroy event handler is used with a Vanilla JS Component', () => {
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

    it('should be called when the component is about to get destroyed', async () => {
        const preDestroyCallback = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .on('preDestroy', preDestroyCallback);

        await waitForRenderCycle();
        expect(preDestroyCallback).not.toHaveBeenCalled();

        aiChat.mount(rootElement);
        await waitForRenderCycle();
        expect(preDestroyCallback).not.toHaveBeenCalled();

        aiChat.unmount();
        await waitForRenderCycle();
        expect(preDestroyCallback).toHaveBeenCalledOnce();

        expect(preDestroyCallback).toHaveBeenCalledWith({
            aiChatProps: expect.objectContaining({
                adapter: adapterController.adapter,
            }),
            conversationHistory: [],
        });
    });

    it('should be called with conversation history and options', async () => {
        const preDestroyCallback = vi.fn();

        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat()
            .withAdapter(adapterController.adapter)
            .withClassName('my-class')
            .withConversationOptions({
                scrollWhenGenerating: false,
            })
            .withInitialConversation([
                {
                    role: 'user',
                    message: 'Hello',
                },
                {
                    role: 'ai',
                    message: 'Hi',
                },
            ])
            .on('preDestroy', preDestroyCallback);


        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Tell me a joke');
        await waitForRenderCycle();

        await submit();
        await waitForRenderCycle();

        adapterController.resolve('Why did the chicken cross the road? To get to the other side.');
        await waitForRenderCycle();

        aiChat.unmount();
        await waitForRenderCycle();

        expect(preDestroyCallback).toHaveBeenCalledWith(expect.objectContaining({
            aiChatProps: expect.objectContaining({
                adapter: adapterController.adapter,
                className: 'my-class',
                conversationOptions: {
                    scrollWhenGenerating: false,
                },
                initialConversation: [
                    {
                        role: 'user',
                        message: 'Hello',
                    },
                    {
                        role: 'ai',
                        message: 'Hi',
                    },
                ],
            }),
            conversationHistory: [
                {
                    role: 'user',
                    message: 'Hello',
                },
                {
                    role: 'ai',
                    message: 'Hi',
                },
                {
                    role: 'user',
                    message: 'Tell me a joke',
                },
                {
                    role: 'ai',
                    message: 'Why did the chicken cross the road? To get to the other side.',
                },
            ],
        }));
    });
});
