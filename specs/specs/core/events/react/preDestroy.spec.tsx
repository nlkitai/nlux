import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('When pre-destroy event handler is used with React JS AiChat component', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called when the component is about to get destroyed', async () => {
        const preDestroy = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                preDestroy,
            }}
        />;

        const {unmount} = render(component);
        await waitForRenderCycle();
        expect(preDestroy).not.toHaveBeenCalled();

        unmount();
        await waitForRenderCycle();
        expect(preDestroy).toHaveBeenCalledOnce();
    });

    it('should be called with conversation history and options', async () => {
        const preDestroyCallback = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            className="my-class"
            conversationOptions={{
                scrollWhenGenerating: false,
            }}
            events={{
                preDestroy: preDestroyCallback,
            }}
            initialConversation={[
                {
                    role: 'user',
                    message: 'Hello',
                },
                {
                    role: 'ai',
                    message: 'Hi',
                },
            ]}
        />;

        const {unmount} = render(component);
        await waitForRenderCycle();

        await type('Tell me a joke');
        await waitForRenderCycle();

        await submit();
        await waitForRenderCycle();

        adapterController.resolve('Why did the chicken cross the road? To get to the other side.');
        await waitForRenderCycle();

        unmount();
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
