import {createAiChat, AiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {AdapterController, createPromiseAdapterController} from '../../utils/adapters';
import {qAll, queries, selectors} from '../../utils/selectors';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../utils/wait';

const delayBeforeSendingResponse = 100;

describe('When user expects a message to be generated', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement | undefined;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;

        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
        rootElement = undefined;
    });

    describe('When a prompt is submitted in fetch mode', () => {
        beforeEach(() => {
            adapterController = createPromiseAdapterController({
                includeFetchText: true,
                includeStreamText: false,
            });
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
            adapterController = createPromiseAdapterController({
                includeFetchText: false,
                includeStreamText: true,
            });
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
