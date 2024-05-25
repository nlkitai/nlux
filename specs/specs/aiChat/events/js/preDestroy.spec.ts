import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + events + preDestroy', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the component is destroyed', () => {
        it('It should trigger the preDestroy event', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('preDestroy', preDestroyCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledOnce();
        });

        it('It should trigger the preDestroy event with the correct details', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withClassName('test-class')
                .on('preDestroy', preDestroyCallback)
                .withMessageOptions({
                    skipStreamingAnimation: true,
                })
                .withDisplayOptions({
                    width: '100%',
                    height: 800,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    messageOptions: {
                        skipStreamingAnimation: true,
                    },
                    displayOptions: {
                        width: '100%',
                        height: 800,
                    },
                },
                conversationHistory: [],
            });
        });

        it('It should provide initial conversation as part of conversation history', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withInitialConversation([
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi'},
                ])
                .on('preDestroy', preDestroyCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    initialConversation: [
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi'},
                    ],
                },
                conversationHistory: [
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi'},
                ],
            });
        });
    });

    describe('When the component is destroyed after a conversation', () => {
        it('It should trigger the preDestroy event with the correct conversation history', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withInitialConversation([
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi! How can I help you?'},
                ])
                .on('preDestroy', preDestroyCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Tell me a joke{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Why did the chicken cross the road? To get to the other side.');
            await waitForMdStreamToComplete(80);

            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    initialConversation: [
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi! How can I help you?'},
                    ],
                },
                conversationHistory: [
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi! How can I help you?'},
                    {role: 'user', message: 'Tell me a joke'},
                    {role: 'assistant', message: 'Why did the chicken cross the road? To get to the other side.'},
                ],
            });
        });
    });

    describe('When the event callback is updated after the component is mounted', () => {
        it('It should call the updated callback when the component is destroyed', async () => {
            // Arrange
            const preDestroyCallback1 = vi.fn();
            const preDestroyCallback2 = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('preDestroy', preDestroyCallback1);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            aiChat.removeEventListener('preDestroy', preDestroyCallback1);
            aiChat.on('preDestroy', preDestroyCallback2);
            aiChat.unmount();
            await waitForRenderCycle();

            // Assert
            expect(preDestroyCallback1).not.toHaveBeenCalled();
            expect(preDestroyCallback2).toHaveBeenCalledOnce();
        });
    });
});
