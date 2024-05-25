import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + events + preDestroy', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is destroyed', () => {
        it('It should trigger the preDestroy event', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            const aiChat = (
                <AiChat adapter={adapterController!.adapter} events={{preDestroy: preDestroyCallback}}/>
            );

            const {unmount} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            unmount();
            await waitForReactRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledOnce();
        });

        it('It should trigger the preDestroy event with the correct details', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    className="test-class"
                    events={{preDestroy: preDestroyCallback}}
                    displayOptions={{
                        width: '100%',
                        height: 800,
                    }}
                />
            );

            const {unmount} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            unmount();
            await waitForReactRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    displayOptions: {
                        width: '100%', height: 800,
                    },
                },
                conversationHistory: [],
            });
        });

        it('It should provide initial conversation as part of conversation history', async () => {
            // Arrange
            const preDestroyCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    className="test-class"
                    events={{preDestroy: preDestroyCallback}}
                    displayOptions={{
                        width: '100%', height: 800,
                    }}
                    initialConversation={[
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi'},
                    ]}
                />
            );

            const {unmount} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            unmount();
            await waitForReactRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    displayOptions: {width: '100%', height: 800},
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
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{preDestroy: preDestroyCallback}}
                    className="test-class"
                    displayOptions={{
                        width: '100%', height: 800,
                    }}
                    initialConversation={[
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi! How can I help you?'},
                    ]}
                />
            );

            const {container, unmount} = render(aiChat);
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Tell me a joke{enter}');
            await waitForReactRenderCycle();

            adapterController?.resolve('Why did the chicken cross the road? To get to the other side!');
            await waitForReactRenderCycle();

            // Act
            unmount();
            await waitForReactRenderCycle();

            // Assert
            expect(preDestroyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    displayOptions: {
                        width: '100%', height: 800,
                    },
                    initialConversation: [
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi! How can I help you?'},
                    ],
                },
                conversationHistory: [
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi! How can I help you?'},
                    {role: 'user', message: 'Tell me a joke'},
                    {role: 'assistant', message: 'Why did the chicken cross the road? To get to the other side!'},
                ],
            });
        });
    });

    describe('When the event callback is updated after the component is mounted', () => {
        it('It should call the updated callback when the component is destroyed', async () => {
            // Arrange
            const preDestroyCallback1 = vi.fn();
            const preDestroyCallback2 = vi.fn();
            const aiChat = (
                <AiChat adapter={adapterController!.adapter} events={{preDestroy: preDestroyCallback1}}/>
            );

            const {unmount, rerender} = render(aiChat);
            await waitForReactRenderCycle();

            rerender(
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{preDestroy: preDestroyCallback2}}
                />,
            );
            await waitForReactRenderCycle();

            // Act
            unmount();
            await waitForReactRenderCycle();

            // Assert
            expect(preDestroyCallback1).not.toHaveBeenCalled();
            expect(preDestroyCallback2).toHaveBeenCalledOnce();
        });
    });
});
