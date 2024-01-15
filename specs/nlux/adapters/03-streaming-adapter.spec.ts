import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {submit, type} from '../../utils/userInteractions';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../utils/wait';

describe('When a streaming adapter is used to generate text', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        adapterController = adapterController = adapterBuilder().withStreamText().create();
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('streamText should be called with the text from the prompt box and an observer', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        expect(adapterController.streamTextMock).toHaveBeenCalledWith(
            'Hello',
            expect.objectContaining({
                next: expect.anything(),
                error: expect.anything(),
                complete: expect.anything(),
            }),
        );
    });

    it('Prompt box should switch to loading state on click', async () => {
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

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should remain in loading state until complete() is called', async () => {
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

        adapterController.complete();
        await waitForRenderCycle();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should remain in loading state until error() is called', async () => {
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

        adapterController.error(new Error('Something went wrong'));
        await waitForRenderCycle();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should remain in loading state when text is being streamed', async () => {
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

        adapterController.next('Hi');
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        adapterController.next('Human!');
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Text being returned by the adapter should be rendered as it is streamed', async () => {
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        expect(queries.conversationMessagesContainer()).not.toContainHTML('Yo');
        adapterController.next('Yo');
        await waitForMdStreamToComplete();
        expect(queries.conversationMessagesContainer()).toContainHTML('Yo');


        expect(queries.conversationMessagesContainer()).not.toContainHTML('Human');
        adapterController.next(' Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();
        expect(queries.conversationMessagesContainer()).toContainHTML('Yo Human!');
    });
});
