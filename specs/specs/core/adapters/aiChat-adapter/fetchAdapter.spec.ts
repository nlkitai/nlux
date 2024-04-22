import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter(fetchAdapter)', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('fetchText should be called with the text from the prompt box', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
    });

    it('Prompt box should switch to loading state on submit', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
        const promptBox: HTMLDivElement = rootElement.querySelector('.nlux-comp-prmptBox')!;

        // Act
        await userEvent.type(textArea, 'Hello');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(promptBox).not.toHaveClass('nlux-prmpt-submitting');

        // Act
        await userEvent.click(sendButton);
        await waitForRenderCycle();

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(promptBox).toHaveClass('nlux-prmpt-submitting');
    });

    it('Prompt box should remain in loading state until text is returned', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
        const promptBox: HTMLDivElement = rootElement.querySelector('.nlux-comp-prmptBox')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        const waitingTime = Math.floor(Math.random() * 1000) + 500;
        await waitForMilliseconds(waitingTime);

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(promptBox).toHaveClass('nlux-prmpt-submitting');
    });

    it('Prompt box should switch back to normal state when text is returned', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
        const promptBox: HTMLDivElement = rootElement.querySelector('.nlux-comp-prmptBox')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        await waitForMilliseconds(100);

        // Assert
        expect(promptBox).toHaveClass('nlux-prmpt-submitting');

        // Act
        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(promptBox).not.toHaveClass('nlux-prmpt-submitting');
    });

    it('Text returned from fetchText should be displayed in the conversation', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Act
        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        // Assert
        const messages = rootElement.querySelector('.nlux_msg_incoming')!;
        expect(messages).toHaveTextContent('Hi Human!');
    });

    it('Prompt box should switch back to normal state when promise is rejected', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-prmptBox > button')!;
        const promptBox: HTMLDivElement = rootElement.querySelector('.nlux-comp-prmptBox')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        await waitForMilliseconds(100);

        // Assert
        expect(promptBox).toHaveClass('nlux-prmpt-submitting');

        // Act
        adapterController.reject('Error');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(promptBox).not.toHaveClass('nlux-prmpt-submitting');
        expect(promptBox).toHaveClass('nlux-prmpt-typing');
    });
});
