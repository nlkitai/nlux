import {AiChat, createAiChat} from '@nlux/core';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {qAll, queries, selectors} from '../../../utils/selectors';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

const delayBeforeCheckingDom = 50;

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

        it('The sent message should immediately transition to loaded status', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.sentMessageContainer()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeCheckingDom);

            expect(qAll(selectors.sentMessageContainer)()).toHaveLength(1);
            expect(queries.sentMessageContainer()).toHaveClass('message-status-loaded');
        });

        it('The received message should be in loading status', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.receivedMessageContainer()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeCheckingDom);

            expect(qAll(selectors.receivedMessageContainer)()).toHaveLength(1);
            expect(queries.receivedMessageContainer()).toHaveClass('message-status-loading');
        });

        describe('When the response is received', () => {
            it('The received message should transition to loaded status', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loading');

                adapterController.resolve('Hello back!');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loaded');
            });
        });

        describe('When the response is received with an error', () => {
            it('The received message should be deleted', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loading');

                adapterController.reject('Error!');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).not.toBeInTheDocument();
            });

            it('The user should be able to send a new prompt', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loading');

                adapterController.reject('Error!');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).not.toBeInTheDocument();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loading');

                adapterController.resolve('Hello back!');
                await waitForRenderCycle();
                await waitForMdStreamToComplete(20);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loaded');
                expect(queries.receivedMessageContainer()).toHaveTextContent('Hello back!');
            });
        });
    });

    describe('When a prompt is submitted in stream mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder().withStreamText().create();
        });

        it('The sent message should render in loaded status', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.sentMessageContainer()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeCheckingDom);

            expect(qAll(selectors.sentMessageContainer)()).toHaveLength(1);
            expect(queries.sentMessageContainer()).toHaveClass('message-status-loaded');
        });

        it('The received message should be in connecting status', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();

            await userEvent.type(textInput, 'Hi');
            await waitForRenderCycle();

            expect(queries.receivedMessageContainer()).not.toBeInTheDocument();

            await userEvent.click(sendButton);
            await waitForRenderCycle();
            await waitForMilliseconds(delayBeforeCheckingDom);

            expect(qAll(selectors.receivedMessageContainer)()).toHaveLength(1);
            expect(queries.receivedMessageContainer()).toHaveClass('message-status-connecting');
        });

        describe('When the first chunk of response is received', () => {
            it('The received message should transition to streaming status', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-connecting');
                expect(queries.receivedMessageContainer()).not.toHaveClass('message-status-streaming');

                adapterController.next('Hello');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-streaming');
            });
        });

        describe('When the stream has completed', () => {
            it('The received message should transition to loaded status', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();

                adapterController.next('Hello');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-streaming');
                expect(queries.receivedMessageContainer()).not.toHaveClass('message-status-loaded');

                adapterController.complete();
                await waitForRenderCycle();
                await waitForMdStreamToComplete(100);

                expect(queries.receivedMessageContainer()).toHaveTextContent('Hello');
                expect(queries.receivedMessageContainer()).toHaveClass('message-status-loaded');
            });
        });

        describe('When the stream has errored', () => {
            it('The received message should be deleted', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textInput: any = queries.promptBoxTextInput();
                const sendButton: any = queries.promptBoxSendButton();

                await userEvent.type(textInput, 'Hi');
                await waitForRenderCycle();

                await userEvent.click(sendButton);
                await waitForRenderCycle();

                adapterController.next('Hello');
                await waitForRenderCycle();
                await waitForMilliseconds(delayBeforeCheckingDom);

                expect(queries.receivedMessageContainer()).toHaveClass('message-status-streaming');
                expect(queries.receivedMessageContainer()).not.toHaveClass('message-status-loading-error');

                adapterController.error(new Error('Error!'));
                await waitForRenderCycle();

                expect(queries.receivedMessageContainer()).not.toBeInTheDocument();
            });
        });
    });
});
