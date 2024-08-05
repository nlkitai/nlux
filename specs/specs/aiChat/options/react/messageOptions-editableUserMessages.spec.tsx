import {AiChat, ChatItem} from '@nlux-dev/react/src';
import {queryAllByText, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + editableUserMessages', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When editableUserMessages is not set', () => {
        it('Users should not be able to edit messages', async () => {
            // Arrange
            const initialConversation: ChatItem[] = [
                {role: 'user', message: 'Hello'},
                {role: 'assistant', message: 'Hi there!'},
            ];

            const aiChat = <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation} />;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const userMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-message.nlux_msg_sent .nlux-markdown-container')!;

            // Act
            userMessage.click();
            await userEvent.type(userMessage, ' AI!');

            // Assert
            expect(userMessage.textContent).toBe('Hello\n');
        });
    });

    describe('When editableUserMessages is set', () => {
        it.skip('Users should be able to edit a user message', async () => {
            // Arrange
            const initialConversation: ChatItem[] = [
                {role: 'user', message: 'Hello'},
                {role: 'assistant', message: 'Hi there!'},
            ];

            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{ editableUserMessages: true }}
                    initialConversation={initialConversation}
                />
            );
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const userMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-message.nlux_msg_sent .nlux-markdown-container')!;

            // Act
            userMessage.click();
            await userEvent.type(userMessage, 'Hi AI!');

            // Assert
            expect(userMessage.textContent).toBe('Hi AI!');
        });

        describe('On blur without submit', () => {
            it('Should not update the message', async () => {
                // Arrange
                const initialConversation: ChatItem[] = [
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi there!'},
                ];

                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{ editableUserMessages: true }}
                        initialConversation={initialConversation}
                    />
                );
                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const userMessage: HTMLTextAreaElement = container.querySelector('.nlux-comp-message.nlux_msg_sent .nlux-markdown-container')!;

                // Act
                await act(async () => {
                    userMessage.click();
                    await userEvent.type(userMessage, 'Hi AI!');
                    userMessage.blur();
                });

                // Assert
                expect(userMessage.textContent).toBe('Hello');
            });
        });

        describe.skip('When the user edits and submits a message from initial conversation', () => {
            it('Should remove all the messages after the edited message', async () => {
                // Arrange
                const initialConversation: ChatItem[] = [
                    {role: 'user', message: 'Hello'},
                    {role: 'assistant', message: 'Hi there!'},
                    {role: 'user', message: 'How are you?'},
                    {role: 'assistant', message: 'I am good!'},
                ];

                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{ editableUserMessages: true }}
                        composerOptions={{ submitShortcut: 'Enter' }}
                        initialConversation={initialConversation}
                    />
                );

                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const initialUserMessages = container.querySelectorAll('.nlux_msg_sent .nlux-markdown-container')!;
                const userMessage: HTMLTextAreaElement = initialUserMessages[0] as HTMLTextAreaElement; // The first user message

                // Act
                await act(async () => {
                    userMessage.click();
                    await userEvent.type(userMessage, 'Yo AI!{enter}');
                    userMessage.blur();
                });
                await waitForReactRenderCycle();

                // Assert
                expect(initialUserMessages.length).toBe(2); // Initially, there were 2 user messages

                const allUserMessages = container.querySelectorAll('.nlux-comp-message.nlux_msg_sent');
                expect(allUserMessages.length).toBe(1); // Messages after the edited message should be removed

                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Yo AI!');
            });
        });

        it.skip('Users should be able to edit and resubmit messages multiple times', async () => {
            // Arrange
            const initialConversation: ChatItem[] = [
                {role: 'user', message: 'Hello'},
                {role: 'assistant', message: 'Hi there!'},
                {role: 'user', message: 'How are you?'},
                {role: 'assistant', message: 'I am good!'},
            ];

            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{ editableUserMessages: true }}
                    composerOptions={{ submitShortcut: 'Enter' }}
                    initialConversation={initialConversation}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const textarea = container.querySelector('textarea')!;
            await userEvent.type(textarea, 'Can you help me?{enter}');
            await waitForReactRenderCycle();

            adapterController?.resolve('Sure, I can help you!');
            await waitForReactRenderCycle();

            // Assert
            const lastUserMessage = container.querySelectorAll('.nlux_msg_sent .nlux-markdown-container')[2] as HTMLElement;
            expect(lastUserMessage.textContent).toBe('Can you help me?\n');
            expect(queryAllByText(container, 'Sure, I can help you!').length).toBe(1);

            // Act — Edit last message
            await userEvent.click(lastUserMessage);
            await waitForReactRenderCycle();

            await userEvent.type(lastUserMessage, 'Help pleeaaazze!{enter}');
            await waitForReactRenderCycle();

            // Assert
            const lastUserMessage2 = container.querySelectorAll('.nlux_msg_sent .nlux-markdown-container')[2] as HTMLElement;
            expect(lastUserMessage2).toHaveTextContent('Help pleeaaazze!');
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Help pleeaaazze!');
        });
    });
});
