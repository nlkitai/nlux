import {AiChat, ChatItem} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../utils/wait';

describe.each([
        {dataTransferMode: 'batch'},
        // {dataTransferMode: 'stream'},
    ] satisfies Array<{dataTransferMode: 'stream' | 'batch'}>,
)('<AiChat /> + withAdapter($mode) + conversationHistory extras', ({dataTransferMode}) => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the chat is created with initial conversation history', () => {
        it('Should pass the initial conversation history to the adapter extras', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {role: 'assistant', message: 'Hello, how can I help you?'},
                {role: 'user', message: 'I need help with my account.'},
                {role: 'assistant', message: 'Sure, I can help you with that.'},
            ];

            const {container} = render(
                <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>,
            );

            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(adapterController!.getLastExtras()?.conversationHistory).toEqual([...initialConversation]);
        });

        describe('When the user types a message and gets a response', () => {
            it('The new conversation history should include the user message and the AI response', async () => {
                // Arrange
                const initialConversation: ChatItem<string>[] = [
                    {role: 'assistant', message: 'Hello, how can I help you?'},
                    {role: 'user', message: 'I need help with my account.'},
                    {role: 'assistant', message: 'Sure, I can help you with that.'},
                ];

                const {container} = render(
                    <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>,
                );

                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                await userEvent.type(textArea, 'So what did you do?{enter}');
                await waitForReactRenderCycle();

                if (dataTransferMode === 'batch') {
                    adapterController!.resolve('I helped you with your account.');
                } else {
                    adapterController!.next('I helped you with your account.');
                    adapterController!.complete();
                }

                await act(() => waitForMdStreamToComplete(60));

                // Assert
                expect(container.innerHTML).toEqual(
                    expect.stringContaining('I helped you with your account.'),
                );

                // Act
                await userEvent.type(textArea, 'Thank you!{enter}');
                await waitForReactRenderCycle();

                // Assert
                const newConversationHistory = adapterController!.getLastExtras()?.conversationHistory;
                expect(newConversationHistory).toEqual([
                    ...initialConversation,
                    {role: 'user', message: 'So what did you do?'},
                    {role: 'assistant', message: 'I helped you with your account.'},
                ]);
            });
        });
    });

    describe('When conversation history is set to 0', () => {
        it('Should not pass the initial conversation history to the adapter extras', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {role: 'assistant', message: 'Hello, how can I help you?'},
                {role: 'user', message: 'I need help with my account.'},
                {role: 'assistant', message: 'Sure, I can help you with that.'},
            ];

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    initialConversation={initialConversation}
                    conversationOptions={{
                        historyPayloadSize: 0,
                    }}
                />,
            );

            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(adapterController!.getLastExtras()?.conversationHistory).toBeUndefined();
        });
    });

    describe('When conversation history is set to a specific number', () => {
        it('Should pass the specified number of messages from the initial conversation history to the adapter extras',
            async () => {
                // Arrange
                const initialConversation: ChatItem<string>[] = [
                    {role: 'assistant', message: 'Hello, how can I help you?'},
                    {role: 'user', message: 'I need help with my account.'},
                    {role: 'assistant', message: 'Sure, I can help you with that.'},
                ];

                const {container} = render(
                    <AiChat
                        adapter={adapterController!.adapter}
                        initialConversation={initialConversation}
                        conversationOptions={{
                            historyPayloadSize: 2,
                        }}
                    />,
                );

                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                // Assert
                expect(adapterController!.getLastExtras()?.conversationHistory).toEqual([
                    {role: 'user', message: 'I need help with my account.'},
                    {role: 'assistant', message: 'Sure, I can help you with that.'},
                ]);
            },
        );
    });
});
