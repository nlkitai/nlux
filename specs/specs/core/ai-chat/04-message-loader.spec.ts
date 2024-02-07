import {AiChat, createAiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {qAll, queries, selectors} from '../../../utils/selectors';
import {
    delayBeforeSendingResponse,
    waitForMdStreamToComplete,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../../utils/wait';

describe('When user expects a message to be generated', () => {
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

    describe('When a prompt is submitted in fetch mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder().withFetchText().create();
        });

        it('A single loading indicator should be shown inside the receiving message', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.conversationMessagesLoadingSpinner()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeSendingResponse);

            expect(queries.conversationMessagesLoadingSpinner()).toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(1);
        });

        it('A loading indicator should hide when the response is received', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeSendingResponse);

            expect(queries.conversationMessagesLoadingSpinner()).toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(1);

            adapterController.resolve('Hello back!');
            await waitForRenderCycle();
            await waitForMdStreamToComplete(100);

            expect(queries.conversationMessagesLoadingSpinner()).not.toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(0);
        });
    });

    describe('When a prompt is submitted in stream mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder().withStreamText().create();
        });

        it('A single loading indicator should be shown inside the receiving message', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.conversationMessagesLoadingSpinner()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeSendingResponse);

            expect(queries.conversationMessagesLoadingSpinner()).toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(1);
        });

        it('A loading indicator should hide when the first chunk of response is received', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeSendingResponse);

            expect(queries.conversationMessagesLoadingSpinner()).toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(1);

            adapterController.next('Hello back!');
            await waitForRenderCycle();
            await waitForMdStreamToComplete(100);

            expect(queries.conversationMessagesLoadingSpinner()).not.toBeInTheDocument();
            expect(qAll(selectors.conversationMessagesLoadingSpinner)()).toHaveLength(0);
        });
    });
});
