import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter(batchAdapter)', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('batchText should be called with the text from the composer', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(adapterController.batchTextMock).toHaveBeenCalledWith('Hello');
    });

    it('Composer should switch to loading state on submit', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(composer).not.toHaveClass('nlux-composer--submitting');

        // Act
        await userEvent.click(sendButton);
        await waitForRenderCycle();

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--submitting');
    });

    it('Composer should remain in loading state until text is returned', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        const waitingTime = Math.floor(Math.random() * 1000) + 500;
        await waitForMilliseconds(waitingTime);

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--submitting');
    });

    it('Composer should switch back to normal state when text is returned', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        await waitForMilliseconds(100);

        // Assert
        expect(composer).toHaveClass('nlux-composer--submitting');

        // Act
        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(composer).not.toHaveClass('nlux-composer--submitting');
    });

    it('Text returned from batchText should be displayed in the conversation', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Act
        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        // Assert
        const messages = rootElement.querySelector('.nlux_msg_received')!;
        expect(messages).toHaveTextContent('Hi Human!');
    });

    it('Composer should switch back to normal state when promise is rejected', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        await waitForMilliseconds(100);

        // Assert
        expect(composer).toHaveClass('nlux-composer--submitting');

        // Act
        adapterController.reject('Error');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(composer).not.toHaveClass('nlux-composer--submitting');
        expect(composer).toHaveClass('nlux-composer--typing');
    });
});
