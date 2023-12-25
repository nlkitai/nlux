import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {
    delayBeforeSendingResponse,
    waitForMdStreamToComplete,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('When typing a prompt ', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    describe('Initial state', () => {
        it('should render an empty prompt box with disabled button', async () => {
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            expect(textInput.value).toBe('');
            expect(sendButton).toBeDisabled();
        });
    });

    describe('When the user types a prompt', () => {
        it('should enable the send button', async () => {
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();
        });
    });

    describe('When the user clears the prompt', () => {
        it('should disable the send button', async () => {
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();

            await userEvent.clear(textInput);
            await waitForRenderCycle();

            expect(textInput.value).toBe('');
            expect(sendButton).toBeDisabled();
        });
    });
});

describe('When sending a chat message ', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    describe('When the user clicks the send button', () => {
        it('should display the user message in conversation container', async () => {
            adapterController = adapterBuilder().withStreamText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);

            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello LLM');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello LLM');
            expect(sendButton).not.toBeDisabled();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(100);

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello LLM');
        });

        it('should display a loading indicator', async () => {
            adapterController = adapterBuilder().withStreamText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);

            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();
            expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            expect(sendButton).toBeDisabled();
            expect(sendButton).toHaveClass('nluxc-prompt-box-send-button-loading');
        });

        describe('When the API call fails', () => {
            it('should display an error message', async () => {
                adapterController = adapterBuilder().withFetchText().create();
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);

                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput() as any;
                const sendButton: any = queries.promptBoxSendButton() as any;

                await userEvent.type(textInput, 'Hello');
                await waitForRenderCycle();

                expect(textInput.value).toBe('Hello');
                expect(sendButton).not.toBeDisabled();

                expect(queries.exceptionMessage()).toBeEmptyDOMElement();
                await userEvent.click(sendButton);
                await waitForRenderCycle();

                expect(adapterController.getLastMessage()).toBe('Hello');
                adapterController.reject('Something went wrong');
                await waitForRenderCycle();

                expect(queries.exceptionMessage()).not.toBeEmptyDOMElement();
            });

            it('Should remove the initial user message', async () => {
                adapterController = adapterBuilder().withFetchText().create();

                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput() as any;
                const sendButton: any = queries.promptBoxSendButton() as any;

                await userEvent.type(textInput, 'Hello');
                await waitForRenderCycle();

                expect(textInput.value).toBe('Hello');
                expect(sendButton).not.toBeDisabled();

                await userEvent.click(sendButton);
                await waitForMilliseconds(delayBeforeSendingResponse / 2);
                expect(queries.conversationMessagesContainer()).toContainHTML('Hello');

                adapterController.reject('Something went wrong');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeSendingResponse + 10);
                expect(queries.conversationMessagesContainer()).not.toContainHTML('Hello');
            });

            it('Should remove received message loader', async () => {
                adapterController = adapterBuilder().withFetchText().create();

                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput() as any;
                const sendButton: any = queries.promptBoxSendButton() as any;

                await userEvent.type(textInput, 'Hello');
                await waitForRenderCycle();

                expect(textInput.value).toBe('Hello');
                expect(sendButton).not.toBeDisabled();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(50);

                expect(queries.conversationMessagesLoadingSpinner()).toBeInTheDocument();

                adapterController.reject('Something went wrong');
                await waitForRenderCycle();

                expect(queries.conversationMessagesLoadingSpinner()).not.toBeInTheDocument();
            });

            it('Should remove the received message container', async () => {
                adapterController = adapterBuilder().withFetchText().create();

                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput() as any;
                const sendButton: any = queries.promptBoxSendButton() as any;

                await userEvent.type(textInput, 'Hello');
                await waitForRenderCycle();

                expect(textInput.value).toBe('Hello');
                expect(sendButton).not.toBeDisabled();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(50);

                expect(queries.receivedMessageContainer()).toBeInTheDocument();

                adapterController.reject('Something went wrong');
                await waitForRenderCycle();

                expect(queries.receivedMessageContainer()).not.toBeInTheDocument();
            });

            it('should keep the content of the prompt box', async () => {
                adapterController = adapterBuilder().withFetchText().create();

                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput() as any;
                const sendButton: any = queries.promptBoxSendButton() as any;

                await userEvent.type(textInput, 'Hello');
                await waitForRenderCycle();

                expect(textInput.value).toBe('Hello');
                expect(sendButton).not.toBeDisabled();

                await userEvent.click(sendButton);
                await waitForMilliseconds(100);

                expect(textInput.value).toBe('Hello');
            });
        });
    });

    describe('When API call fails', () => {
        it('should render error message', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            adapterController.reject('Something went wrong');
            await waitForRenderCycle();

            expect(queries.exceptionMessage()).toHaveTextContent('Failed to load content. Please try again.');
        });
    });

    describe('When the user receives a response', () => {
        it('should display the response', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hi');
            expect(sendButton).not.toBeDisabled();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            adapterController.resolve('Hello back!');
            await waitForRenderCycle();

            await waitForMdStreamToComplete();
            expect(queries.conversationContainer()).toHaveTextContent('Hello back!');
        });

        it('should remove the loading indicator', async () => {
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            adapterController.resolve('Hello back!');
            await waitForRenderCycle();

            await waitForMdStreamToComplete();
            expect(sendButton).not.toHaveClass('nluxc-prompt-box-send-button-loading');
        });

        it('should empty the prompt box', async () => {
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            adapterController.resolve('Hello back!');
            await waitForRenderCycle();
            await waitForMdStreamToComplete();

            expect(textInput.value).toBe('');
        });
    });
});
