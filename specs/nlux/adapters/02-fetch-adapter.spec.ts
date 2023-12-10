import {createConvo, NluxConvo} from '@nlux/nlux';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {AdapterController, createPromiseAdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../utils/wait';

describe('When a fetch adapter is used to generate text', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement | undefined;
    let nluxConvo: NluxConvo | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);

        adapterController = createPromiseAdapterController({
            includeFetchText: true,
            includeStreamText: false,
        });
    });

    afterEach(() => {
        nluxConvo?.unmount();
        rootElement?.remove();
        nluxConvo = undefined;
        rootElement = undefined;
        adapterController = undefined;
    });

    it('fetchText should be called with the text from the prompt box', async () => {
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
    });

    it('Prompt box should switch to loading state', async () => {
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        expect(textInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Prompt box should remain in loading state until text is returned', async () => {
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();

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
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        expect(textInput).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');

        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });

    it('Text returned from fetchText should be displayed in the conversation', async () => {
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        adapterController.resolve('Hi Human!');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(queries.conversationMessagesContainer()).toContainHTML('Hi Human!');
    });

    it('Prompt box should switch back to normal state when promise is rejected', async () => {
        nluxConvo = createConvo().withAdapter(adapterController.adapter);
        nluxConvo.mount(rootElement);
        await waitForRenderCycle();

        const textInput: any = queries.promptBoxTextInput() as any;
        const sendButton: any = queries.promptBoxSendButton() as any;

        await userEvent.type(textInput, 'Hello');
        await waitForRenderCycle();

        await userEvent.click(sendButton);
        await waitForRenderCycle();

        expect(textInput).toBeDisabled();
        expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');

        adapterController.reject('Error');
        await waitForRenderCycle();
        await waitForMdStreamToComplete();

        expect(textInput).not.toBeDisabled();
        expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
    });
});
