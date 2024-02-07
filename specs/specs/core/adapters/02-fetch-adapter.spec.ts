import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {submit, type} from '../../../utils/userInteractions';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('When a fetch adapter is used to generate text', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('fetchText should be called with the text from the prompt box', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
    });

    it('Prompt box should switch to loading state', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await type('Hello');

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');

        await submit();
        await waitForRenderCycle();

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should remain in loading state until text is returned', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await type('Hello');
        await submit();

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');

        // Wait for a random amount of time between 500ms and 1500ms to simulate the text being returned
        const waitingTime = Math.floor(Math.random() * 1000) + 500;
        await waitForMilliseconds(waitingTime);

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should switch back to normal state when text is returned', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await type('Hello');
        await submit();

        expect(textInput).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');

        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Text returned from fetchText should be displayed in the conversation', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(queries.conversationMessagesContainer()).toContainHTML('Hi Human!');
    });

    it('Prompt box should switch back to normal state when promise is rejected', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await type('Hello');
        await submit();

        expect(textInput).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');

        adapterController.reject('Error');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });
});
