import {AiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../utils/wait';

describe('When the create a AiChat box', () => {
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

    describe('When the user adds a message to an AiChat', () => {
        it('should scroll to the bottom when scrollWhenGenerating is set to true', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withConversationOptions({scrollWhenGenerating: true});

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();
            const messagesContainer = queries.conversationMessagesContainer();

            await userEvent.type(textInput, 'Hello LLM!');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMdStreamToComplete();

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello LLM!');

            adapterController.resolve('Hi\n\n\n\n\nLLM!');
            await waitForMdStreamToComplete(50);

            const scrollToParams = {behavior: 'instant', top: 50000};
            expect(messagesContainer?.scrollTo).toHaveBeenCalledWith(scrollToParams);
        });

        it('should scroll to the bottom when scrollWhenGenerating is set to false', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withConversationOptions({scrollWhenGenerating: false});

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();
            const messagesContainer = queries.conversationMessagesContainer();

            await userEvent.type(textInput, 'Hello LLM!');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMdStreamToComplete();

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello LLM!');

            adapterController.resolve('Hi LLM!');
            await waitForMdStreamToComplete(50);

            const scrollToParams = {behavior: 'instant', top: 50000};
            expect(messagesContainer?.scrollTo).toHaveBeenCalledWith(scrollToParams);
        });
    });

    describe('When a message is being streamed to an AiChat', () => {
        it('should keep scrolling to the bottom when scrollWhenGenerating is true', async () => {
            adapterController = adapterBuilder().withStreamText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withConversationOptions({scrollWhenGenerating: true});

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();
            const messagesContainer = queries.conversationMessagesContainer();

            await userEvent.type(textInput, 'Hello LLM!');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMdStreamToComplete();

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello LLM!');

            const timesScrollToBottomCalledBeforeNextChunk = (messagesContainer?.scrollTo as any)?.mock.calls.length;
            adapterController.next('Hi LLM!');
            await waitForMdStreamToComplete(50);

            const timesScrollToBottomCalledAfterNextChunk = (messagesContainer?.scrollTo as any)?.mock.calls.length;
            expect(timesScrollToBottomCalledAfterNextChunk).toBeGreaterThan(timesScrollToBottomCalledBeforeNextChunk);
        });

        it('should not keep scrolling to the bottom when scrollWhenGenerating is false', async () => {
            adapterController = adapterBuilder().withStreamText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withConversationOptions({scrollWhenGenerating: false});

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();
            const messagesContainer = queries.conversationMessagesContainer();

            await userEvent.type(textInput, 'Hello LLM!');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMdStreamToComplete();

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello LLM!');

            const timesScrollToBottomCalledBeforeNextChunk = (messagesContainer?.scrollTo as any)?.mock.calls.length;
            adapterController.next('Hi LLM!');
            await waitForMdStreamToComplete(50);

            const timesScrollToBottomCalledAfterNextChunk = (messagesContainer?.scrollTo as any)?.mock.calls.length;
            expect(timesScrollToBottomCalledAfterNextChunk).toEqual(timesScrollToBottomCalledBeforeNextChunk);
        });
    });
});
