import {AiChat, ChatItem} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../utils/wait';

describe.each([
        {dataTransferMode: 'fetch'},
        // {dataTransferMode: 'stream'},
    ] satisfies Array<{dataTransferMode: 'stream' | 'fetch'}>,
)('<AiChat /> + withAdapter($mode) + conversationHistory extras', ({dataTransferMode}) => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the chat is created with initial conversation history', () => {
        it('Should pass the initial conversation history to the adapter extras', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {role: 'ai', message: 'Hello, how can I help you?'},
                {role: 'user', message: 'I need help with my account.'},
                {role: 'ai', message: 'Sure, I can help you with that.'},
            ];

            const {container} = render(
                <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>,
            );

            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.getLastExtras()?.conversationHistory).toEqual([...initialConversation]);
        });

        describe('When the user types a message and gets a response', () => {
            it('The new conversation history should include the user message and the AI response', async () => {
                // Arrange
                const initialConversation: ChatItem<string>[] = [
                    {role: 'ai', message: 'Hello, how can I help you?'},
                    {role: 'user', message: 'I need help with my account.'},
                    {role: 'ai', message: 'Sure, I can help you with that.'},
                ];

                const {container} = render(
                    <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>,
                );

                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                await userEvent.type(textArea, 'So what did you do?{enter}');
                await waitForRenderCycle();

                if (dataTransferMode === 'fetch') {
                    adapterController!.resolve('I helped you with your account.');
                } else {
                    adapterController!.next('I helped you with your account.');
                    adapterController!.complete();
                }

                // Assert
                await waitForMdStreamToComplete(60);
                expect(container.innerHTML).toEqual(
                    expect.stringContaining('I helped you with your account.'),
                );

                // Act
                await userEvent.type(textArea, 'Thank you!{enter}');
                await waitForRenderCycle();

                // Assert
                const newConversationHistory = adapterController!.getLastExtras()?.conversationHistory;
                expect(newConversationHistory).toEqual([
                    ...initialConversation,
                    {role: 'user', message: 'So what did you do?'},
                    {role: 'ai', message: 'I helped you with your account.'},
                ]);
            });
        });
    });
});
